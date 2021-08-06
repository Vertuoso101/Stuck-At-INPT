const express = require("express");
const {getAllPosts, createPost, getMyPosts, getSpecificUserPost, deletePost, isOwner, like, unlike, deleteComment, addComment} =  require("../comtrollers/post");
const {requireSignIng} = require("../comtrollers/auth");
const router = express.Router();


//here are the post routes and the requirment are clear in thier path to execute them!


router.post("/api/user/create/:id",requireSignIng, createPost);
router.get("/api/user/posts/:id",requireSignIng,getAllPosts );
router.get("/api/user/myposts/:id",requireSignIng, getMyPosts);
router.get("/api/user/post/:id",requireSignIng, getSpecificUserPost);
router.delete("/api/user/postdelete/:userId/:postId",requireSignIng, isOwner, deletePost);
router.put("/api/user/like/:postId/:userId",requireSignIng,like );
router.put("/api/user/ulike/:postId/:userId",requireSignIng,unlike );
router.put("/api/user/deletecomment/:postId/:commentId",requireSignIng, deleteComment);
router.put("/api/user/addcomment/:postId/:userId",requireSignIng,addComment );

module.exports = router;