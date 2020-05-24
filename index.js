const express = require('express');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
var fetch = require('node-fetch');
const logger = require('./useful_func/logger');

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "brunoIsAwesome";

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(SECRET));
app.use('/api/notes', require('./routes/api/notes'));

//home page -> checks if username is set
app.get('/', (req,res) => {
    if(req.signedCookies.name)
        res.redirect('/notes');
    
    else 
        res.render('index');
});

//sets username
app.post('/signCookie', (req,res) => {
    res.cookie('name',req.body.name, {signed: true});
    res.redirect("/notes");
});

//clears username
app.get('/logout', (req,res) => {
    res.clearCookie('name');
    res.redirect("/");
});

//lists all notes of the user
app.get('/notes', async (req,res) => {
    if(req.signedCookies.name){
        let data = await fetch(`http://localhost:3000/api/notes/name/${req.signedCookies.name}`).then(res => res.json());
        
        if(!data.err)
            res.render('notes', {name:req.signedCookies.name, notes:data});
    
        else
            res.render('notes', {name:req.signedCookies.name});
    }    

    else
        res.redirect('/');
});

//creates a note
app.get('/createNote', (req,res) => {
    if(req.signedCookies.name) 
        res.render('createNote', {name: req.signedCookies.name});

    else
        res.redirect('/');
});

//handler for create note button
app.get('/editNote/:id', async (req,res) => {
    if(req.signedCookies.name){
        let data = await fetch(`http://localhost:3000/api/notes/id/${req.params.id}`).then(res => res.json());
        res.render('editNote', {note:data});  
    }
});

//handler for delete button
app.get('/deleteNote/:id', async (req,res) => {
    if(req.signedCookies.name)
        await fetch(`http://localhost:3000/api/notes/id/${req.params.id}`,{method:"DELETE"});

    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));