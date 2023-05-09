module.exports.friends = function(req,res){
    return res.json(200, {
        message: 'List of friends',
        friends: []
    });
}