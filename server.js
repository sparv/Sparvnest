const express = require(`express`)
const passport = require(`passport`)
const bodyParser = require(`body-parser`)

const initLoginStrategy = require(`./services/authentication/login`)
const initRouting = require(`${__dirname}/components/routing/routes`)

const User = require(`./models/User`)
const Customer = require(`./models/Customer`)
const Exercise = require(`./models/Exercise`)
const ExerciseGroup = require(`./models/ExerciseGroup`)
const ExerciseMap = require(`./models/ExerciseMap`)

const config = require(`./server/config.json`)

const server = express()

Exercise.belongsToMany(ExerciseGroup, { through: 'exercisemap' })
ExerciseGroup.belongsToMany(Exercise, { through: 'exercisemap' })

initLoginStrategy()

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(passport.initialize())

initRouting(server, User, Customers, Exercise, ExerciseGroup, ExerciseMap, config)

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
