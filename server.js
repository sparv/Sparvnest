const express = require(`express`)
const sequelize = require(`sequelize`)
const passport = require(`passport`)
const crypto = require(`crypto`)
const path = require(`path`)
const bodyParser = require(`body-parser`)
const cookieParser = require(`cookie-parser`)
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

initLoginStrategy(User)
initUserSessions(User)

//FORM TEST
server.use(express.static(path.join(__dirname, `html`)))

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(cookieParser()) //obsolet depending on express-session repo docs
server.use(session({secret: `supersecretneedstochange`}))
server.use(passport.initialize())
server.use(passport.session())

initRouting(server, User)

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
