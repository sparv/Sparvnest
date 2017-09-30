const passport = require(`passport`)
const createUser = require(`../database/user_registration`)

function routing (server, dbTable) {
	server.get(`/`, (req, res, next) => {
		if (req.isAuthenticated()) {
			res.redirect(`/profile`)
		} else {
			res.redirect(`/register`)
		}
	})

	server.get(`/profile`, (req, res) => {
		if (req.isAuthenticated()) {
			res.send(`<p>Logged in user: ${req.session.passport.user}</p><form action="http://localhost:4040/logout" method="post"><input type="submit" value="logoff" /></form>`)
			res.end()
		} else {
			res.redirect(`/register`)
		}
	})

	server.get(`/error`, (req, res) => {
		res.send(`error`)
	})

	server.get(`/register`, (req, res) => {
		res.send(`<html><body><h2>LOGIN</h2><form action="http://localhost:4040/login" method="post"><div><label>Mail:</label><input type="text" name="email"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form><hr /><h2>REG</h2><form action="http://localhost:4040/register" method="post"><div><label>Mail:</label><input type="text" name="email"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Register"/></div></form></body></html>`)
		res.end()
	})

	server.post(`/register`, (req, res) => {
		createUser(dbTable, req.body, (success, email) => {
			if (success) {
				res.send(`${email} created`)
			} else {
				res.send(`user already registered`)
			}

			res.end()
		})
	})

	server.post(`/login`, (req, res, next) => {
		console.log(`login request`)
		passport.authenticate(`login`, (err, user, info) => {
			if (err) { return next(err) }
			if (!user) {
				console.log(`User not authenticated`)
				return res.send({ auth: false })
			}

			req.login(user, (err) => {
				if (err) { return next(err) }
				return res.send({ auth: true })
			})
		})(req, res, next)
	})

	server.get(`/logout`, (req, res, next) => {
		res.send(`logged out`)
		res.end()
	})

	server.post(`/logout`, (req, res, next) => {
		if (req.isAuthenticated()) {
			req.logout()
			res.redirect(`/logout`)
		} else {
			res.redirect(`/register`)
		}
	})

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
