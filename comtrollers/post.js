const Post = require('../models/post');
const User = require('../models/user');

/* This function helps you get all the other users posts */
const getAllPosts = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.json({msg: 'there is an error!'});
        }
        else {
            Post.find({postedBy: {$in: user.following}})
            .populate("comments", "text created")
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-craetedAt")
            .exec((err, posts) => {
                if(err){
                    res.json({msg: err});
                }
                else {
                    res.json(posts);
                }

            })
        }
    })
    
}

/* This function helps create new posts */
const createPost = (req, res) => {
    const {text} = req.body;
    const post = new Post({
        text,
        postedBy : req.params.id
    });
    post.save((err, data) => {
        if(err){
            res.json({msg: err})
        }
        else {
            res.json(data);
        }
    })
}


/* this function helps you gets all your post */
const getMyPosts = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.json({msg: err});
        }
        else{
            Post.find({postedBy: user})
            .populate("comments", "text created")
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-craetedAt")
            .exec((err, posts) => {
                if(err){
                    res.json({msg: err});
                }
                else {
                    res.json(posts);
                }

            })
        }
    })
}


/* this function helps get a specific user posts by giving his Id */
const getSpecificUserPost = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.json({msg: err});
        }
        else{
            Post.find({postedBy: user})
            .populate("comments", "text created")
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-craetedAt")
            .exec((err, posts) => {
                if(err){
                    res.json({msg: err});
                }
                else {
                    console.log('here')
                    res.json(posts);
                }

            })
        }
    })
}


/* This is a middleware function that makes sure you are the owner of a certain post before deleteing it od do some
other functions involving your post */
const isOwner = (req, res, next) => {
    User.findById(req. params.userId, (err, user)=>{
        Post.findById(req.params.postId, (err, post)=>{
           let userId=user._id;
           let postId=post.postedBy._id;
           const own = JSON.stringify(userId) == JSON.stringify(postId);
            if(!own){
                res.json({msg: "there is an error!"});
            }
            else{
                next();
            }

        })
    })
    
    
    
}

/* this function deletes your post */
const deletePost = (req, res) => {
    Post.findById(req.params.postId, (err, post)=>{
        post.remove((err, post)=>{
            if(err){
                res.json({msg: err});
            }
            else{
                res.json({msg: "post deleted!"})
            }

        })
    });
    
}

/* this function helps you like a post */
const like = (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {$push : {likes: req.params.userId}}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        else {
            res.json({result});
        }
    })
}

/* this function helps unlike a certain post */
const unlike = (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {$pull : {likes: req.params.userId}}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        else {
            res.json({result});
        }
    })
}

/* this finction helps you add comments to posts */
const addComment = (req, res) => {
    const comment = {text : req.body.text};
    comment.postedBy = req.params.userId;
    Post.findByIdAndUpdate(req.params.postId, {$push : {comments: comment}}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        else {
            res.json({result});
        }
    })
}


/* this function helps delete a comment on a certain post */
const deleteComment = (req, res) => {
    const commentId = req.params.commentId;
    Post.findByIdAndUpdate(req.params.postId, {$pull : {comments:{_id: commentId}}}, {new: true})
    .exec((err, result) => {
        if(err){
            res.json({msg: err});
        }
        else {
            res.json({result});
        }
    })
}


module.exports = {
    getAllPosts, 
    createPost, 
    getMyPosts,
    getSpecificUserPost, 
    deletePost, 
    isOwner,
    like,
    unlike, 
    addComment,
    deleteComment
}