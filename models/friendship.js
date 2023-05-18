const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    //user who sent the request
    from_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // user who accepted the request
    to_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const FriendShip = mongoose.model('FriendShip',friendshipSchema);
module.exports = FriendShip;