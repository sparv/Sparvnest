const express = require(`express`)
const router = express.Router()

const exerciseGroupAdd = require(`../services/exercisegroup/exercise_group_add`)
const exerciseGroupAllGet = require(`../services/exercisegroup/exercise_group_all_get`)
const exerciseGroupGet = require(`../services/exercisegroup/exercise_group_get`)
const exerciseGroupUpdate = require(`../services/exercisegroup/exercise_group_update`)
const exerciseGroupDelete = require(`../services/exercisegroup/exercise_group_delete`)
const exerciseAdd = require(`../services/exercisegroup/exercise_group_exercise_add`)
const exerciseAllGet = require(`../services/exercisegroup/exercise_group_exercise_all_get`)
const exerciseGet = require(`../services/exercisegroup/exercise_group_exercise_get`)
const exerciseUpdate = require(`../services/exercisegroup/exercise_group_exercise_update`)
const exerciseDelete = require(`../services/exercisegroup/exercise_group_exercise_delete`)

router.get(`/`, (req, res) => exerciseGroupAllGet(req, res))
router.post(`/`, (req, res) => exerciseGroupAdd(req, res))

router.get(`/:exercisegroupId`, (req, res) => {
  exerciseGroupGet(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.patch(`/:exercisegroupId`, (req, res) => {
  exerciseGroupUpdate(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.delete(`/:exercisegroupId`, (req, res) => {
  exerciseGroupDelete(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.get(`/:exercisegroupId/exercises`, (req, res) => {
  exerciseAllGet(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.get(`/exercises/:exerciseId`, (req, res) => {
  exerciseGet(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.post(`/:exercisegroupId/exercises`, (req, res) => {
  exerciseAdd(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.patch(`/exercises/:exerciseId`, (req, res) => {
  exerciseUpdate(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

router.delete(`/exercises/:exerciseId`, (req, res) => {
  exerciseDelete(req, res)
    .catch(error => console.error(`[ERROR]: ${error.statusCode}`))
})

module.exports = router
