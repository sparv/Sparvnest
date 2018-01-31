const express = require(`express`)
const router = express.Router()

const Users = require(`../models/User`)
const Customers = require(`../models/Customer`)
const Exercises = require(`../models/Exercise`)
const ExerciseGroups = require(`../models/ExerciseGroup`)
const ExerciseMap = require(`../models/ExerciseMap`)

router.get(`/`, (req, res) => {
  Users.sync({force: true})
  Customers.sync({force: true})
  Exercises.sync({force: true})
  ExerciseGroups.sync({force: true})
  .then(() => {
    ExerciseMap.sync({force: true})
  })
  .then(() => {
    res.send(`db reset`)
    res.end()
  })
})

module.exports = router
