const express = require(`express`)
const router = express.Router()

const getAllPlans = require(`../services/workoutplan/getAllPlans`)
const getPlan = require(`../services/workoutplan/getPlan`)
const addPlan = require(`../services/workoutplan/addPlan`)

router.get(`/`, (req, res) => getAllPlans(req, res))
router.get(`/:workoutplanId`, (req, res) => getPlan(req, res))
router.post(`/`, (req, res) => addPlan(req, res))

module.exports = router
