const FriendShip = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/users');

const home = async (req, res)=>{
    // console.log(req.cookies);
    let posts;
    let users;
    let user_friends;
    let friends = [];
    try{
        // populate the user of each post
        posts = await Post.find({}).populate('user').sort('-createdAt')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            },
            populate:{
                path: 'likes'
            }
        }).populate('likes');
        if(!posts)
        {
            console.log('users find is empty');
            return;
        }
        users = await User.find({});
        if(req.user != null)
        {
            user_friends = await FriendShip.find({from_user: req.user._id});
            for(let f of user_friends)
            {
                let user = await User.findById(f.to_user);
                friends.push({id: f._id,user: user});
            }
            console.log(friends);
        }
    }
    catch(err){
        console.log(err);
    }
    return res.render('home', {
        title: 'Home',
        posts: posts,
        all_users: users,
        all_friends: friends
    });
}

const homeNo = function(req, res){
    const homeId = req.params.homeID;
    res.end('<h1> Your Home Number is => '+homeId+'</h1>');
}

module.exports = {home, homeNo};