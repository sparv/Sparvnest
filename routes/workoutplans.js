const express = require(`express`)
const router = express.Router()

const getAllPlans = require(`../services/workoutplan/getAllPlans`)
const getPlan = require(`../services/workoutplan/getPlan`)
const addPlan = require(`../services/workoutplan/addPlan`)
const deletePlan = require(`../services/workoutplan/deletePlan`)
const updatePlan = require(`../services/workoutplan/updatePlan`)
const addExerciseToPlan = require(`../services/workoutplan/addExerciseToPlan`)

router.get(`/`, (req, res) => getAllPlans(req, res))
router.get(`/:workoutplanId`, (req, res) => getPlan(req, res))
router.post(`/`, (req, res) => addPlan(req, res))
router.delete(`/:workoutplanId`, (req, res) => deletePlan(req, res))
router.patch(`/:workoutplanId`, (req, res) => updatePlan(req, res))

router.post(`/:workoutplanId/exercises`, (req, res) => addExerciseToPlan(req, res))

module.exports = router
