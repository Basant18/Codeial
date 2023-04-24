const Post = require('../models/post');

const home = async (req, res)=>{
    // console.log(req.cookies);
    let posts;
    try{
        // populate the user of each post
        posts = await Post.find({}).populate('user');
        if(!posts)
        {
            console.log('users find is empty');
            return;
        }
    }
    catch(err){
        console.log(err);
    }
    return res.render('home', {
        title: 'Home',
        posts: posts
    });
}

const homeNo = function(req, res){
    const homeId = req.params.homeID;
    res.end('<h1> Your Home Number is => '+homeId+'</h1>');
}

module.exports = {home, homeNo};