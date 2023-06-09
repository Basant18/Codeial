const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.posts = function(req,res){
    res.end('<h1>Posts created</h1>');
}

module.exports.create = async (req,res) => {
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: post
                },
                message: 'POST created!'
            });
        }
        req.flash('success', 'Post published!');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async (req,res) => {
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object id to string
        if(post.user == req.user.id)
        {
           // CHANGE :: delete the associated likes for the post and all it's comments likes too
           await Like.deleteMany({likeable: post,onModel: 'Post'});
           await Like.deleteMany({_id:{$in: post.comments}}); 
           
           await post.deleteOne();
           await Comment.deleteMany({post: req.params.id});
           if(req.xhr)
           {
              return res.status(200).json({
                data:{
                    post_id: req.params.id
                },
                message: "Post deleted successfully"
              });
           }
           req.flash('success', 'Post and associated comment deleted!');
           return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', err);
    }
    // req.flash('error', 'You cannot delete this post!');
    return res.redirect('back');
}