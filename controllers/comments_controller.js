const User = require('../models/users');
const Post = require('../models/post');
const Comments = require('../models/comment');

module.exports.create = async(req,res) => {
    try{
        let post = await Post.findById(req.body.post);
        if(post)
        {
            let comment = await Comments.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            await post.save();
            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message: 'Comment Created!'
                });
            }
        }
    }
    catch(err){
        console.log(err);
        return;
    }
    return res.redirect('back'); 
}

module.exports.destroy = async (req,res) => {
    try{
        let comment = await Comments.findById(req.params.id); 
        if(comment.user == req.user.id)
        {
            let postId = comment.post;
            await comment.deleteOne();
            let post = await Post.findByIdAndUpdate(postId, {$pull:{comments: req.params.id}});
            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message: "Comment deleted successfully"
                });
            }
            //await post.deleteOne();
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
    }
    return res.redirect('back');
}