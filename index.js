const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose'); 

//middlewares
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'))

app.use(expressLayouts);
//extract styles and scripts from the sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use express router 
app.use('/', require('./routes'))

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 

app.listen(PORT, function(err){
    if(err)
    {
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port: ${PORT}`);
});