const express = require(`express`)
const sequelize = require(`sequelize`)
const passport = require(`passport`)
const crypto = require(`crypto`)
const path = require(`path`)
const bodyParser = require(`body-parser`)
const flash = require(`connect-flash`)

//SPARVNEST COMPONENTS
const initDb = require(`${__dirname}/components/database/init`)
const tables = require(`${__dirname}/components/database/tables`)
const initLoginStrategy = require(`${__dirname}/components/authentication/login`)
const initRouting = require(`${__dirname}/components/routing/routes`)

const config = require(`./config.json`)

const server = express()

//DATABASE CONFIGURATION
const db = initDb(config)
const User = tables.User(db)

initLoginStrategy(User)

//FORM TEST
server.use(express.static(path.join(__dirname, `html`)))

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(passport.initialize())

initRouting(server, User, config)

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
