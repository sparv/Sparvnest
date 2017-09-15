const passport = require(`passport`)
const createUser = require(`../database/user_registration`)

function routing (server, dbTable) {
	server.get(`/`, (req, res, next) => {
		passport.authenticate(`login`, (err, user, info) => {
			if (err) { return next(err) }
			if (!user) { return res.sendFile(`/html/form.html`, { root: `.` }) }

			req.logIn(user, (err) => {
				if (err) { return next(err) }
				return res.redirect(`/suc`)
			})
		})(req, res, next)
	})

	server.get(`/suc`, (req, res) => {
		res.send(`suc`)
	})

	server.get(`/nonoo`, (req, res) => {
		res.send(`nonoo`)
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

	//DEBUGGING PURPOSE ONLY
	server.get(`/resetDB`, (req, res) => {
		dbTable.sync({force: true})
			.then(() => {
				res.send(`db reset`)
				res.end()
			})
	})
}

module.exports = routing
