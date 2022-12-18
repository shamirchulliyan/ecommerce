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

//Generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

//check wheather email exists or not
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await
    User.findOne({ email });
    if (!user) {
        throw new Error('Unable to log in');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

//Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
 });

const User = mongoose.model('User', userSchema);
module.exports = User;
