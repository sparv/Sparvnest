const express = require(`express`)
const router = express.Router()

const Users = require(`../models/User`)
const Customers = require(`../models/Customer`)
const Exercises = require(`../models/Exercise`)
const ExerciseGroups = require(`../models/ExerciseGroup`)
const ExerciseMap = require(`../models/ExerciseMap`)

router.get(`/`, (req, res) => {
  Users.sync({force: true})
    .then(() => {
      Customers.sync({force: true})
        .then(() => {
          ExerciseGroups.sync({force: true})
            .then(() => {
              Exercises.sync({force: true})
                .then(() => {
                  res.send(`db reset`)
                  res.end()
                })
            })
        })
    })
})

module.exports = router
