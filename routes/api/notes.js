const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//TODO add user verification
//TODO should be a database
let notes = require('../../Notes');

//debug function that lists all notes
//router.get('/', (req,res) => {res.json(notes);});

//gets a note given an id
router.get('/id/:id', (req,res) =>{
    const found = notes.some(note => note.id === parseInt(req.params.id));

    if(found)
        notes.forEach(note => {
            if(note.id === parseInt(req.params.id))
                res.status(200).json(note);
        });

    else
        res.status(400).json({err:`No note with id ${req.params.id}`});
});

//gets all notes bellonging to a user
router.get('/name/:name', (req,res) => {
    const found = notes.some(note => note.name === req.params.name);

    if(found)
        res.status(200).json(notes.filter(note => note.name === req.params.name));

    else
        res.status(400).json({err:`${req.params.name} doesnt have any notes`});
});

//creates a new note
router.post('/create', (req,res) => {
    const newNote = {
        id: notes.length,
        name: req.signedCookies.name,
        note: req.body.note
    }

    if(!newNote.name || !newNote.note)
        return res.status(400).json({err:'No name or note'});

    if(newNote.note)
        notes.push(newNote);

    res.redirect("/");
});

//changes a note given an id
router.put('/id/:id', (req,res) => {
    const found = notes.some(note => note.id === parseInt(req.params.id));

    if(found)
        notes.forEach(note => {
            if(note.id === parseInt(req.params.id)){
                note.note = req.body.note ? req.body.note : note.note;
                res.status(200).json(note);
            }
        });

    else
        res.status(400).json({err:`No note with id ${req.params.id}`});
});

//form handler
router.post('/edit/:id', (req,res) => {
    fetch(`http://localhost:3000/api/notes/id/${req.params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
    
    res.redirect("/");
});

//deletes a note given an id
router.delete('/id/:id', (req,res) =>{
    const found = notes.some(note => note.id === parseInt(req.params.id));

    if(found){
        notes = notes.filter(note => note.id !== parseInt(req.params.id));
        res.status(200).json({msg:`Deleted note with id ${req.params.id}`});
    }

    else
        res.status(400).json({err:`No note with id ${req.params.id}`});
});

module.exports = router;