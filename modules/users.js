const db = require('./db');

module.exports = {
		verify: (username,password) => {
				if(!db.getUser({username:username,pw:password})) return {err:`Incorrect username or password`};
				else return {msg:`Login successfull`};
		},
		create: (username,password) => {
				console.log(username);
				if(db.userExists({username:username})) return {err:`User ${username} already exists`};
				db.createUser({username:username,pw:password});
				return {msg:`Successfully created user ${username}`};
		}
}
