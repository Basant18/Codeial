const Post = require('../models/post');
const User = require('../models/users');

const home = async (req, res)=>{
    // console.log(req.cookies);
    let posts;
    let users;
    try{
        // populate the user of each post
        posts = await Post.find({}).populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });
        if(!posts)
        {
            console.log('users find is empty');
            return;
        }
        users = await User.find({});
    }
    catch(err){
        console.log(err);
    }
    return res.render('home', {
        title: 'Home',
        posts: posts,
        all_users: users
    });
}

const homeNo = function(req, res){
    const homeId = req.params.homeID;
    res.end('<h1> Your Home Number is => '+homeId+'</h1>');
}

module.exports = {home, homeNo};