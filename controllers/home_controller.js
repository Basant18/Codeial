const home = function(req, res){
    res.end('<h1>Express is up for codeial!</h1>');
}

const homeNo = function(req, res){
    const homeId = req.params.homeID;
    res.end('<h1> Your Home Number is => '+homeId+'</h1>');
}

module.exports = {home, homeNo};