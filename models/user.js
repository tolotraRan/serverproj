const Joi = require("joi");

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.JWTPRIVATEKEY;

const userSchema = new mongoose.Schema({
    firstName : { type: String },
    lastName : { type: String },
    email : { type: String, required: true },
    password : { type: String, required: true },
});

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({ _id: this._id}, jwtPrivateKey, {expiresIn:"7d"});
    return token;
};

const User = mongoose.model("User", userSchema);

const validate =(data) =>{
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
};

module.exports = { User, validate };
