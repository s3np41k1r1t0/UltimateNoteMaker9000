const bcrypt = require('bcrypt');
const sqlite = require('better-sqlite3');
const notesdb = new sqlite("./databases/notes.sqlite3");
const usersdb = new sqlite("./databases/users.sqlite3");

const initUsers = () => {
		usersdb.prepare(`CREATE TABLE IF NOT EXISTS users(
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT,
				pw TEXT
		);`).run();
}

const initNotes = () => {
		notesdb.prepare(`CREATE TABLE IF NOT EXISTS notes(
				id INTEGER PRIMARY KEY,
				uid TEXT,
				username TEXT,
				note TEXT
		);`).run();
}

//initializes db
initUsers();
initNotes();

const notes = {
		getNote: notesdb.prepare(`select * from notes where uid = ?;`),
		getNotes: notesdb.prepare(`select * from notes where username = ?;`),
		createNote: notesdb.prepare(`insert into notes (uid, username, note) values (?,?,?);`),
		editNote: notesdb.prepare(`update notes set note = ? where uid = ? and username = ?`),
		deleteNote: notesdb.prepare(`delete from notes where uid = ?`) //not working atm
}

const users = {
		getUser: usersdb.prepare(`select username,pw from users where username = ?;`),
		createUser: usersdb.prepare(`insert into users (username, pw) values (?,?)`)
}

module.exports = {
		getNote: ({uid}) => {
				return notes.getNote.get(uid);
		},
		getNotes: ({username}) => {
				return notes.getNotes.all(username);
		},
		createNote: ({uid,username,note}) => {
				notes.createNote.run(uid,username,note);
		},
		editNote: ({username,note,uid}) => {
				notes.editNote.run(note,uid,username);
		},
		deleteNote: ({uid}) => {
				notes.deleteNote.run(uid);
		},
		createUser: ({username,pw}) => {
				let hash = bcrypt.hashSync(pw,10);
				users.createUser.run(username,hash);
		},
		getUser: ({username,pw}) => {
				let user = users.getUser.get(username);
				if(!user) return null;
				return bcrypt.compareSync(pw,user.pw) ? user : null;
		},
		userExists: ({username}) => {
				return users.getUser.get(username);
		}
}
