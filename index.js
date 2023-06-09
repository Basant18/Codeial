const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app)
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose'); 
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat serer to be used with socket.io
const chatServer = require('http').Server(app);
const ChatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listing on port 5000');
const path = require('path');

//middlewares
app.use(express.urlencoded());
app.use(cookieParser());
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(env.asset_path));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
//extract styles and scripts from the sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 
//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },(err) => {console.log(err || 'connect-mongodb setup ok');})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router 
app.use('/', require('./routes'))

app.listen(PORT, function(err){
    if(err)
    {
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port: ${PORT}`);
});