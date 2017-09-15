const passport = require(`passport`)
const createUser = require(`../database/user_registration`)

function routing (server, dbTable) {
	server.get(`/`, (req, res, next) => {
		passport.authenticate(`login`, (err, user, info) => {
			if (err) {
				console.log(`auth error`)
				return next(err)
			}

			console.log(`penis1`)
			console.log(user)

			if (!user) { return res.send(`huen`) }

			req.login(user, (err) => {
				if (err) {
					console.log(`login error`)
					return next(err)
				}

				console.log(`login username: ${res.username}`)

				return res.redirect(`/suc/${res.username}`)
			})
		})(req, res, next)
	})

	server.get(`/suc/:user`, (req, res) => {
		res.send(`suc ${req.params.user}`)
	})

	server.get(`/nonoo`, (req, res) => {
		console.log()
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
