const passport = require(`passport`)
const createUser = require(`../database/user_registration`)
const jwt = require(`jsonwebtoken`)

function routing (server, dbTable, config) {
	server.use((req, res, next) => {
		res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
		res.append(`Access-Control-Allow-Headers`, [`Authorization`, `Content-Type`])
		next()
	})

	server.post(`/register`, (req, res) => {
		createUser(dbTable, req.body, (success, email) => {
			if (success) {
				res.send({
					username: email,
					isRegistered: true
				})
			} else {
				res.send({
					username: null,
					isRegistered: false
				})
			}

			res.end()
		})
	})

	server.post(`/validate`, (req, res) => {
		//REALLY ugly work, needs refactor
		console.log(req.headers.authorization)
		const token = req.headers.authorization.split(`;`)[0].replace(`Bearer `, ``)

		if ((token !== `undefined`) && (token !== ``)) {
			jwt.verify(token, config.auth.secret, (err, verification) => {
				if (err) {
					res.send({
						username: null,
						createdAt: null,
						isAuthenticated: false
					})
				}

				dbTable.findOne({ where: { email: verification.name } })
					.then((user) => {
						res.send({
							username: user.email,
							createdAt: user.createdAt,
							isAuthenticated: true
						})
						res.end()
					})
					.catch((err) => {
						res.send({
							username: null,
							createdAt: null,
							isAuthenticated: false
						})
						res.end()
					})
			})
		} else {
			res.send({
				username: null,
				createdAt: null,
				isAuthenticated: false
			})
			res.end()
		}
	})

	server.post(`/login`, (req, res, next) => {
		passport.authenticate(`login`, (err, user, info) => {
			if (err) { return next(err) }
			if (!user) {
				console.log(`User not authenticated`)
				return res.send({
					auth: false,
					user: null,
					token: null
				})
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
