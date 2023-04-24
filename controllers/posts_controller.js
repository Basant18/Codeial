const Post = require('../models/post');

module.exports.posts = function(req,res){
    res.end('<h1>Posts created</h1>');
}

module.exports.create = async (req,res) => {
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
    }
    catch(err){
        console.log(err);
    }
    return res.redirect('back');
}