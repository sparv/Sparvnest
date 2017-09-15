const passport = require(`passport`)
const createUser = require(`../database/user_registration`)

function routing (server, dbTable) {
	server.get(`/suc`, (req, res) => {
		res.send(`suc`)
	})

	server.get(`/nonoo`, (req, res) => {
		res.send(`nonoo`)
	})

	server.get(`/resetDB`, (req, res) => {
		dbTable.sync({force: true})
			.then(() => {
				res.send(`db reset`)
				res.end()
			})
	})

	server.post(`/register`, (req, res) => {
		createUser(dbTable, req.body, (success, email) => {
			console.log(`createUser Callback`)
			if (success) {
				res.send(`${email} created`)
			} else {
				res.send(`user already registered`)
			}

			res.end()
		})
	})

	server.post(`/login`, passport.authenticate(`login`, {
		successRedirect: `/suc`,
		failureRedirect: `/nonoo`
	}))
}

module.exports = routing
