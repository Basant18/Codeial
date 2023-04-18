const home = function(req, res){
    console.log(req.cookies);
    return res.render('home', {
       title: 'Home'
    });
}

const homeNo = function(req, res){
    const homeId = req.params.homeID;
    res.end('<h1> Your Home Number is => '+homeId+'</h1>');
}

module.exports = {home, homeNo};