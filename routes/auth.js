const router = require("express").Router();
const { User, validate } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const validateData = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

router.post("/", async (req, res) => {
    try {
        const { error } = validateData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send({ message: "User already registered." });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
