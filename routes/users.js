const express = require(`express`)
const router = express.Router()

const userRegistration = require(`../services/user/user_registration`)
const userProfileGet = require(`../services/user/user_profile_get`)
const userUpdate = require(`../services/user/user_update`)
const userDelete = require(`../services/user/user_delete`)

const config = require(`../server/config`)

router.get(`/`, (req, res) => {
  userProfileGet(req, res, config)
    .catch(error => console.error(error.statusCode))
})

router.post(`/`, (req, res) => {
  userRegistration(res, req.body, config)
    .catch(error => console.error(error.statusCode))
})

router.put(`/`, (req, res) => {
  userUpdate(req, res, config)
    .catch(error => console.error(error.statusCode))
})

router.delete(`/`, (req, res) => {
  userDelete(req, res, config)
    .catch(error => console.error(error.statusCode))
})

module.exports = router
