const passport = require(`passport`)
const createUser = require(`../database/user_registration`)
const jwt = require(`jsonwebtoken`)

function routing (server, dbTable, config) {
	server.use((req, res, next) => {
		res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
		res.append(`Access-Control-Allow-Headers`, [`Authorization`])
		next()
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

	server.post(`/checkauth`, (req, res) => {
		const token = req.headers.authorization.replace(`Bearer `, ``)

		if ((token !== `undefined`) && (token !== ``)) {
			console.log(`:::${token}:::`)
			const verification = jwt.verify(token, config.auth.secret)

			dbTable.findOne({ where: { email: verification.name } })
				.then((user) => {
					res.send({
						username: user.email,
						createdAt: user.createdAt,
						isAuthenticated: true
					})
				})
				.catch((err) => {
					res.send({
						username: false,
						createdAt: false,
						isAuthenticated: false
					})
				})
		} else {
			res.send({
				username: false,
				createdAt: false,
				isAuthenticated: false
			})
		}
		
	})

	server.post(`/login`, (req, res, next) => {
		console.log(`login request`)
		passport.authenticate(`login`, (err, user, info) => {
			if (err) { return next(err) }
			if (!user) {
				console.log(`User not authenticated`)
				return res.send({ auth: false })
			} else {
				const jwtPayload = {
					"sub": "user_authentication",
					"name": user.email
				}

				const token = jwt.sign(jwtPayload, config.auth.secret)

				return res.send({
					auth: true,
					user: user.email,
					token: token
				})
			}
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
