const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    try
    {
        posts = await Post.find({}).populate('user').sort('-createdAt')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });
        return res.json(200, {
               message: "List of posts",
               posts: posts
        });
    }
    catch(err)
    {
        return res.json(404,{
            message: err
        });
    }
}

module.exports.destroy = async (req,res) => {
    try{
        let post = await Post.findById(req.params.id);
        
        if(post.user == req.user.id)
        {
            post.deleteOne();
            await Comment.deleteMany({post: req.params.id});
            return res.status(200).json({
                 message: "Post and associated commets deleted successfully!"
            });
        }
        else{
            return res.status(400).json({
                message: 'You cannot delete this post!'
            });
        }
           
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server error',
            error: err
        });
    }
}