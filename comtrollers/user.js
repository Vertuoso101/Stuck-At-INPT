const User = require('../models/user');
const {isMatch} = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const bcrypt = require('bcryptjs');

//create a new user

const createUser = async (req, res) => {
    const {name, email, password} = req.body;
    const user =  new User({
        name,
        email
    });
    user.salt = await bcrypt.genSaltSync(10);
    user.hashed_password = await bcrypt.hashSync(password, user.salt);
    user.save((err, user) => {
        if(err){
            res.json({error: err});
        }
        res.json(user);
    });
};

//get a certain user by giving his Id
const getUser =(req, res) => {
    
    User.findById(req.params.id, function (err, users) {
        if (err){
            console.log(err);
        }
        else{
            const test = users;
            test.salt = undefined;
            test.hashed_password = undefined;
            res.json(test);
        }
    });
};


// follow a certain user
const follow =(req, res) => {
    const target = req.params.targetId;
    const user = req.params.userId
    User.findByIdAndUpdate(target, {$push : {followers: user }}, {new: true})
    .exec((err, result) => {
        if(err) {
            res.json({msg: err});
        }
        else{
            res.json({msg :'You followed that user!'})
        }
    })
    User.findByIdAndUpdate(user, {$push : {following: target }}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        
    })

}


//unfllow a certain user
const unfollow =(req, res) => {
    const target = req.params.targetId;
    const user = req.params.userId
    User.findByIdAndUpdate(target, {$pull : {followers: user }}, {new: true})
    .exec((err, result) => {
        if(err) {
            res.json({msg: err});
        }
        else{
            res.json({msg :'You unfollowed that user!'})
        }
    });
    User.findByIdAndUpdate(user, {$pull : {following: target }}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        
    });

}

/* this middleware function makes sure you are not following a user before executing
the follow function */

const followCheck =(req,res, next) => {
    const user =  req.params.userId;
    User.findById(user,(err, us)=>{
        if(err){
            res.json({msg: err});
        }
        else {
            const test = us.following.includes(req.params.targetId);
            if(test){
                res.json({msg: "You are alraedy following this user!"});
            }
            else{
                next();
            }
        }
    })
}


/* this middleware function makes sure you are following a user before executing
the unfollow function*/
const unfollowCheck =(req,res, next) => {
    const user =  req.params.userId;
    User.findById(user,(err, us)=>{
        if(err){
            res.json({msg: err});
        }
        else {
            const test = us.following.includes(req.params.targetId);
            if(test){
                next();
            }
            else{
                res.json({msg: "You are not following this user!"});
            }
        }
    })
}






module.exports = {
    createUser,
    getUser,
    follow, 
    unfollow,
    followCheck,
    unfollowCheck
};