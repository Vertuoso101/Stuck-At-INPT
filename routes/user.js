const express = require('express');
const {createUser, getUser, follow, unfollow, followCheck, unfollowCheck} = require('../controllers/user');
const {signIn, logOut, requireSignIng} = require('../controllers/auth');
const router = express.Router();

//here are the user routes and the requirment are clear in thier path to execute them!


router.post('/api/users/create', createUser);
router.get('/api/users/:id', getUser);
router.post('/api/users/signin', signIn);
router.get('/api/user/logout', logOut);
router.put('/api/:userId/follow/:targetId',followCheck, follow);
router.put('/api/:userId/unfollow/:targetId',unfollowCheck, unfollow);






module.exports = router;
