const express = require(`express`)
const passport = require(`passport`)
const path = require(`path`)
const bodyParser = require(`body-parser`)

// SPARVNEST COMPONENTS
const initDb = require(`${__dirname}/components/database/init`)
const tables = require(`${__dirname}/components/database/tables`)
const initLoginStrategy = require(`${__dirname}/components/authentication/login`)
const initRouting = require(`${__dirname}/components/routing/routes`)

const config = require(`./config.json`)

const server = express()

// DATABASE CONFIGURATION
const db = initDb(config)
const Users = tables.Users(db)
const Customers = tables.Customers(db)
const Exercises = tables.Exercises(db)
const ExerciseGroups = tables.ExerciseGroups(db)

initLoginStrategy(Users)

// FORM TEST
server.use(express.static(path.join(__dirname, `html`)))

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(passport.initialize())

initRouting(server, Users, Customers, Exercises, ExerciseGroups, config)

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
