const express = require(`express`)
const passport = require(`passport`)
const sequelize = require(`sequelize`)
const crypto = require(`crypto`)

const server = express()

const config = require(`./config.json`)

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

const User = db.define(`user`, {
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

//const LocalStrategy = require(`passport-local`).Strategy

//passport.use(new LocalStrategy(
//	function (username, password, done) {
//
//	}
//))

//SERVER ROUTING

server.get(`/`, (req, res) => {
	res.send('hw')
})

server.get(`/create`, (req, res) => {
	const username = `user@name.de`
	const plainPassword = `deineMama123`
	const salt = crypto.randomBytes(128).toString(`base64`)
	const iterations = 100000
	const hash = crypto.pbkdf2Sync(plainPassword, salt, iterations, 512, `sha512`)

	User.sync({force: true})
		.then(() => {
			return User.create({
				email: username,
				password: hash,
				salt: salt
			})
		})
		.then(() => {
			console.log(`Query findAll`)
			User.findAll()
				.then((users) => {
					//console.log(users)
				})
		})

	res.end()
})

server.post(`/login`, passport.authenticate(`local`), (req, res) => {
	console.log(`Auth successful`)
	console.log(req.user)
})


//SERVER CONFIGURATION

server.listen(config.port, () => {
	console.log(`Running on port ${config.port}`)
})
