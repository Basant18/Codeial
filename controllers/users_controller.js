const profile = function(req, res){
    res.end('<h1>User Profile</h1>');
}

const profileUserId = function(req, res){
    const userId = req.params.userID;
    res.end('<h1>User ID => '+ userId +'</h1>'); 
}

module.exports = {profile, profileUserId};