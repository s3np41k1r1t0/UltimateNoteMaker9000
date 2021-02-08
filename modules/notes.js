const db = require('./db');
const uuid = require('uuid');

module.exports = {
		get: (uid) => {
				const note = db.getNote({uid:uid});
				if(note) return note;
				else return {err:`No note with id ${uid}`};
		},
		getByUser: (username) => {
				const notes = db.getNotes({username:username});
				if(notes) return notes;
				else return {err:`User ${username} has no notes`};
		},
		create: (username,note) => {
				const uid = uuid.v4();
				const newNote = {uid:uid,username:username,note:note};
				db.createNote(newNote);
				return newNote;
		},
		edit: (username,note,uid) => {
				if(!db.getNote({uid:uid})) return {err:`No note with id ${uid}`};
				db.editNote({username:username,note:note,uid:uid});
				return {msg:`Successfully edited note ${uid}`};
		},
		delete: (uid) => {
				if(!db.getNote({uid:uid})) return {err:`No note with id ${uid}`};
				db.deleteNote({uid:uid});
				return {msg:`Deleted note with id ${uid}`}
		}
}

