const express = require(`express`)
const router = express.Router()

const Users = require(`../models/User`)
const Customers = require(`../models/Customer`)
const Exercises = require(`../models/Exercise`)
const ExerciseGroups = require(`../models/ExerciseGroup`)
const ExerciseMap = require(`../models/ExerciseMap`)
const WorkoutPlan = require(`../models/WorkoutPlan`)
const WorkoutExercise = require(`../models/WorkoutExercise`)

router.get(`/`, async (req, res) => {
  await Users.sync({force: true})
  await Customers.sync({force: true})
  await ExerciseGroups.sync({force: true})
  await Exercises.sync({force: true})
  await WorkoutPlan.sync({force: true})
  await WorkoutExercise.sync({force: true})

  res.send(`db reset`)
  res.end()
})

module.exports = router
