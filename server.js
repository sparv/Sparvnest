const express = require(`express`)
const passport = require(`passport`)
const sequelize = require('sequelize')

const server = express()

const config = require(`./config.json`)

//DATANASE CONFIGURATION

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


//PASSPORT CONFIGURATION

const LocalStrategy = require(`passport-local`).Strategy

//passport.use(new LocalStrategy(
//	function (username, password, done) {
//
//	}
//))

//SERVER ROUTING

server.get(`/`, (req, res) => {
	res.send('hw')
})

server.post(`/login`, passport.authenticate(`local`), (req, res) => {
	console.log(`Auth successful`)
	console.log(req.user)
})


//SERVER CONFIGURATION

server.listen(config.port, () => {
	console.log(`Running on port ${config.port}`)
})
