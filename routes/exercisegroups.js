const express = require(`express`)
const router = express.Router()

const exerciseAdd = require(`../services/exercise/exercise_add`)
const exerciseAllGet = require(`../services/exercise/exercise_all_get`)
const exerciseGet = require(`../services/exercise/exercise_get`)
const exerciseUpdate = require(`../services/exercise/exercise_update`)
const exerciseDelete = require(`../services/exercise/exercise_delete`)
const exerciseGroupAdd = require(`../services/exercisegroup/exercise_group_add`)
const exerciseGroupAllGet = require(`../services/exercisegroup/exercise_group_all_get`)
const exerciseGroupGet = require(`../services/exercisegroup/exercise_group_get`)
const exerciseGroupUpdate = require(`../services/exercisegroup/exercise_group_update`)
const exerciseGroupDelete = require(`../services/exercisegroup/exercise_group_delete`)
const exerciseGroupExerciseAdd = require(`../services/exercisegroup/exercise_group_exercise_add`)
const exerciseGroupExerciseDelete = require(`../services/exercisegroup/exercise_group_exercise_delete`)

router.get(`/`, (req, res) => {
  exerciseGroupAllGet(req, res)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.get(`/:exercisegroupId`, (req, res) => {
  exerciseGroupGet(req, res)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.post(`/`, (req, res) => {
  exerciseGroupAdd(req, res)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.put(`/:exercisegroupId`, (req, res) => {
  exerciseGroupUpdate(req, res)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.delete(`/:exercisegroupId`, (req, res) => {
  exerciseGroupDelete(req, res)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.get(`/:exercisegroupId/exercises`, (req, res) => {
  exerciseAllGet(req, res, tableExercises)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.get(`/:exercisegroupId/exercises/:exerciseId`, (req, res) => {
  exerciseGet(req, res, tableExercises)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.post(`/:exercisegroupId/exercises`, (req, res) => {
  console.log(`OUAEBFIABFNOAIWFN`)
  exerciseAdd(req, res, tableExercises)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.put(`/:exercisegroupId/exercises/:exerciseId`, (req, res) => {
  exerciseUpdate(req, res, tableExercises)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.delete(`/:exercisegroupId/exercises/:exerciseId`, (req, res) => {
  exerciseDelete(req, res, tableExercises)
    .then(() => console.log(`[STATUS]`))
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

module.exports = router
