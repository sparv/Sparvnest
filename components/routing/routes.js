const passport = require(`passport`)
const createUser = require(`../database/user_registration`)

function routing (server, dbTable) {
	server.get(`/`, (req, res, next) => {
		console.log(`is user authenticated: ${req.isAuthenticated()}`)

		if (req.isAuthenticated()) {
			console.log(`passport session user ${req.session.passport.user}`)
			res.redirect(`/suc/${req.session.passport.user}`)
		} else {
			res.redirect(`/register`)
		}
	})

	server.get(`/suc`, (req, res) => res.redirect(`/register`))

	server.get(`/suc/:user`, (req, res) => {
		if (req.isAuthenticated()) {
			res.send(`suc ${req.params.user}`)
			res.end()
		} else {
			res.redirect(`/register`)
		}
	})

	server.get(`/nonoo`, (req, res) => {
		res.send(`nonoo`)
	})

	server.get(`/register`, (req, res) => {
		res.send(`<html><body><h2>LOGIN</h2><form action="http://localhost:4040/login" method="post"><div><label>Mail:</label><input type="text" name="email"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form><hr /><h2>REG</h2><form action="http://localhost:4040/register" method="post"><div><label>Mail:</label><input type="text" name="email"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Register"/></div></form></body></html>`)
		res.end()
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

	server.post(`/login`, (req, res, next) => {
		passport.authenticate(`login`, (err, user, info) => {
			if (err) { return next(err) }
			if (!user) { return res.redirect(`/nonoo`) }

			req.login(user, (err) => {
				if (err) { return next(err) }
				return res.redirect(`/suc/${user.email}`)
			})
		})(req, res, next)
	})

	server.post(`/logout`, passport.authenticate())

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
