const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = async (req,res) => {
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object id to string
        if(post.user == req.user.id)
        {
           await post.deleteOne();
           await Comment.deleteMany({post: req.params.id});
           return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
    }
    return res.redirect('back');
}