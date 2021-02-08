const express = require('express');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const logger = require('./modules/logger');
const users = require('./modules/users');
const notes = require('./modules/notes'); 

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

//auth middleware
async function auth(req,res,next) {
		if(!req.signedCookies.name) res.redirect("/login");
		else next();
};

//home page
app.get('/', auth, (req,res) => {
    res.redirect('/notes');
});

//sets username
app.get('/login', (req,res) => {
    res.render("login");
});

app.post('/login', async (req,res) => {
		let user = users.verify(req.body.username,req.body.password);
		if(user.err) res.render("login",{err:user.err})
		else {res.cookie('name',req.body.username,{signed:true}); res.redirect("/");}
})

app.get('/register', (req,res) => {
		res.render("register"); //TODO need to build this template
})

app.post('/register', async (req,res) => {
		let user = users.create(req.body.username,req.body.password);
		if(user.err) res.render("register",{err:user.err});
		else res.redirect("/login");
})

//clears username
app.get('/logout', auth, (req,res) => {
    res.clearCookie('name');
    res.redirect("/");
});

//lists all notes of the user
app.get('/notes', auth, async (req,res) => {
		let data = notes.getByUser(req.signedCookies.name);
		if(!data.err) res.render('notes', {name:req.signedCookies.name, notes:data});
		else res.render('notes', {name:req.signedCookies.name});
});

//creates a note
app.get('/createNote', auth, async (req,res) => {
    res.render('createNote', {name: req.signedCookies.name});
});

app.post('/createNote', auth, async (req,res) => {
		let note = notes.create(req.signedCookies.name,req.body.note); 
		if(note.err) res.render('createNote',{err: note.err});
		res.redirect('/notes');
})

//handler for edit note button
app.get('/editNote/:id', auth, async (req,res) => {
		let note = notes.get(req.params.id);
		res.render('editNote', {note:note});  
});

app.post('/editNote/:id', auth, async (req,res) => {
		notes.edit(req.signedCookies.name,req.body.note,req.params.id);
		res.redirect('/notes');
});

//handler for delete button
app.get('/deleteNote/:id', auth, async (req,res) => {
		notes.delete(req.params.id);
    res.redirect('/notes');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
