const express = require(`express`)
const passport = require(`passport`)
const LocalStrategy = require(`passport-local`).Strategy
const sequelize = require(`sequelize`)
const crypto = require(`crypto`)
const path = require(`path`)
const bodyParser = require(`body-parser`)
//NEEDS REVIEW
const flash = require(`connect-flash`)
const session = require(`express-session`)

const config = require(`./config.json`)

const server = express()

//DATABASE CONFIGURATION

const db = new sequelize(config.db.database, config.db.user, config.db.pass, {
	host: config.db.host,
	dialect: `postgres`,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
})

db.authenticate()
	.then(() => {
		console.log(`db auth succ`)
	})
	.catch((err) => {
		console.log(err)
	})

const User = db.define(`users`, {
	email: {
		type: sequelize.STRING,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: sequelize.TEXT
	},
	salt: {
		type: sequelize.STRING
	}
})


//PASSPORT CONFIGURATION
server.use(passport.initialize())
server.use(bodyParser.urlencoded())
server.use(bodyParser.json())

passport.use(`login`, new LocalStrategy({
		passReqToCallback: true,
		usernameField: `email`
	},
	function (req, username, password, done) {
		User.findOne({ where: { email: username } })
			.then((user) => {
				if (user == null) {
					return done(null, false, { message: `Username or password incorrect` })
				}

				const hash = crypto.pbkdf2Sync(password, user.salt, 100000, 512, `sha512`).toString(`base64`)

				if (user.password === hash) {
					return done(null, user)
				}

				return done(null, false, { message: `login error` })
			})
	}
))

passport.serializeUser((user, done) => {
	done(null, user.email)
})

passport.deserializeUser((username, done) => {
	User.findOne({ where: { email: username } })
		.then((user) => {
			done(err, user)
		})
})

//SERVER ROUTING

server.get(`/suc`, (req, res) => {
	res.send(`suc`)
})

server.get(`/nonoo`, (req, res) => {
	res.send(`nonoo`)
})

server.get(`/resetDB`, (req, res) => {
	User.sync({force: true})
		.then(() => {
			res.send(`db reset`)
			res.end()
		})
})

server.post(`/register`, (req, res) => {
	let createUser = function () {
		User.findOne({ where: { email: req.body.email } })
			.then((user) => {
				if (user) {
					console.log(`User already registered`)
					res.send(`user already registered`)
				} else {
					const salt = crypto.randomBytes(128).toString(`base64`)
					const hash = crypto.pbkdf2Sync(req.body.password, salt, 100000, 512, `sha512`).toString(`base64`)

					User.create({
						email: req.body.email,
						password: hash,
						salt: salt
					})
					.then((user) => {
						console.log(`User ${user.email} created`)
						res.send(`${user.email} created`)
					})
				}
			})
			.catch((err) => {
				console.error(`Database error:`, err)
			})
	}

	process.nextTick(createUser)
	res.end()
})

server.post(`/login`, passport.authenticate(`login`, {
	successRedirect: `/suc`,
	failureRedirect: `/nonoo`
}))


//FORM TEST
//
//
//

server.use(express.static(path.join(__dirname, `html`)))
const htmlDir = `./html`

server.get(`/`, (req, res) => {
	res.sendFile(`/html/form.html`, { root: __dirname })
})

//
//
//SERVER CONFIGURATION

server.listen(config.port, () => {
	console.log(`Running on port ${config.port}`)
})
