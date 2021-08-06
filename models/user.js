const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isMatch } = require('lodash');
const {ObjectId} = mongoose.Schema;
const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    image :{
        data : Buffer,
        contentType: String
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    salt: {type : String},
    hashed_password: {
        type: String
    },
    following : [{type: ObjectId, ref: 'User'}],
    followers : [{type: ObjectId, ref: 'User'}]

}, {
    timestamps: true,

});

    


module.exports = mongoose.model('User', UserSchema);