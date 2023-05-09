const Users = require('../../../models/users');
const jwt = require('jsonwebtoken');

const createSession = async function(req, res){
    try{
        let user = await Users.findOne({email: req.body.email});
        if(!user || user.password != req.body.password)
        {
            return res.status(422).json({
                message: "Invalid Username or Password"
            });
        }
        return res.status(200).json({
            message: "Signin successful, Here is your token. Please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(),'codeial',{expiresIn: '100000'})
            }
        });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.createSession = createSession;
