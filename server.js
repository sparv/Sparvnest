const express = require(`express`)
const sequelize = require(`sequelize`)
const passport = require(`passport`)
const crypto = require(`crypto`)
const path = require(`path`)
const bodyParser = require(`body-parser`)
//NEEDS REVIEW
const flash = require(`connect-flash`)
const session = require(`express-session`)

//SPARVNEST COMPONENTS
const initDb = require(`${__dirname}/components/database/init`)
const tables = require(`${__dirname}/components/database/tables`)
const initLoginStrategy = require(`${__dirname}/components/authentication/login`)
const initUserSessions = require(`${__dirname}/components/authentication/usersession`)
const initRouting = require(`${__dirname}/components/routing/routes`)

const config = require(`./config.json`)

const server = express()

//DATABASE CONFIGURATION

const db = initDb(config)
const User = tables.User(db)

//PASSPORT CONFIGURATION
server.use(passport.initialize())
server.use(bodyParser.urlencoded())
server.use(bodyParser.json())

initLoginStrategy(User)
initUserSessions(User)
initRouting(server, User)
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

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
