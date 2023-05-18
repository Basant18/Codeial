const Users = require('../models/users');
const FriendShip = require('../models/friendship');


module.exports.add = async function(req, res){
    // console.log("Query user ID",req.query.id);
    // console.log("Authenticated user ID",req.user.id);
    // return;
    try{
        let newFriend = await Users.findById(req.query.id);
        let user = await Users.findById(req.user.id);
        let found = false;
        for(let friend of user.friendships)
        {
            let u = await FriendShip.findById(friend).populate('to_user');
            if(u.to_user.name == newFriend.name)
            {
                found = true;
                break;
            }
        }
        if(found)
        {
            req.flash('success', "Friend already added");
            return res.redirect('back');
        }
        let friendship = await FriendShip.create({
            from_user: req.user._id,
            to_user: newFriend._id
        });
        user.friendships.push(friendship);
        await user.save();
        req.flash('success', "Friend Added");
        return res.redirect('back');
    }catch(err){
        console.log(err);
        req.flash('error', "Error");
        return res.redirect('back');
    }
}

module.exports.delete = async function(req,res){
    try{
        let friendShip = await FriendShip.findById(req.params.id);
        await friendShip.deleteOne();
        let user = await Users.findByIdAndUpdate(req.user.id,{$pull:{friendships: req.params.id}});
        return res.redirect('back');
    }catch(err){
        console.log(err);
        req.flash('error', "Error");
        return res.redirect('back');
    }
}