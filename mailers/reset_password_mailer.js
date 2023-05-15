const nodeMailer = require('../config/nodemailer');

exports.resetPassword = async (token) => {
    let htmlString = nodeMailer.renderTemplate({token: token},'reset/reset_password.ejs');
    let token1 = await token.populate('user', 'email');
    nodeMailer.transporter.sendMail({
        from: 'bsntsngh16@gmail.com',
        to: token1.user.email,
        subject: 'Reset Password',
        html: htmlString
    },(err,info) =>{
        if(err)
        {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}