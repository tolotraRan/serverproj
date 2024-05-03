const router = require("express").Router();
const {User,validate} = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");


router.post("/", async (req,res) => {
    try {
        console.log("Login request received:", req.body);

        const{error} = validate(req.body);
        if(error)
            return res.status(400).send({message : error.details[0].message});

        const user = await User.findOne({ email : req.body.email });
        if(!user)
            return res.status(401).send({message: "Invalid Email or Password"});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword)
            return res.status(401).send({message: "Invalid Email or Password"});

        console.log("Login successful for user:", user.email);
        res.status(200).send({message: "Login successful"});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({message: "Internal Server Error"});
    }
});


module.exports = router;