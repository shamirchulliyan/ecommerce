const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        min : 3,
        max : 20
    },
    lastName : {
        type : String,
        required : false,
        trim : true,
        min : 3,
        max : 20
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        index : true,
        lowercase : true,
        min : 3,
        max : 20
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate(value) {
            if ( !validator.isEmail(value)){
                throw new Error('This email is invalid!')
            }
        }
    },
    hashpassword : {
        type : String,
        required : true,
        min : 8,
        max : 20
    },
    role : {
        type : String,
        enum : ['user', 'admin',],
        default : 'admin'
    },
    contact : {
        type : Number,
        require : true,
        validate: {
            validator: function(val) {
                return val.toString().length === 10
            },
            message: val => `${val.value} has to be 10 digits`
        }

    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
      
},{
    timestamps : true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
