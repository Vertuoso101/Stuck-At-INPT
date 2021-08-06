const User = require('../models/user');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');
const { isMatch } = require('lodash');
const bcrypt = require('bcryptjs');
const expressjwt = require('express-jwt');



/*This function is the signingup function, it requires you to enter your email and password in the request body
and it craete a token and a cookie for you so you can be marked as signedup */

const signIn = (req, res) => {
    const password = req.body.password;
    
    User.findOne({email : req.body.email}, async (err, user) => {
        
        
        if(err || !user){
            res.json({error : "there is no data!"});
        }
        else{
            const hash = user.hashed_password;
            const valide = await bcrypt.compare(password, hash);
            if(valide){
                const token = jwt.sign({_id: user._id}, '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611');
                res.cookie('t', token)
                const dummy = user;
                dummy.salt = undefined;
                dummy.hashed_password = undefined;
                return res.json({
                    token,
                    dummy
                })
            }
            else{
                res.json({msg : "the credentials are not correcte!"});
            }
                
            }
        })
    }
/* this is a logout function and it helps you log out  */

    const logOut = (req, res) => {
       res.clearCookie('t');
       res.json({msg: 'You are now logged out!'});
    }
/* this is a middleware function that makes sure your authentified before letting you do any action */
    const requireSignIng = expressjwt({
        secret: '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611',
        userProperty: 'auth',
        algorithms: ['HS256']
    })

    

    
 
module.exports = {
    signIn,
    logOut,
    requireSignIng
};
