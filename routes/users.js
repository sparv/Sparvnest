const express = require(`express`)
const router = express.Router()

const registerUser = require(`../services/user/user_registration`)
const getUserProfile = require(`../services/user/user_profile_get`)
const updateUserProfile = require(`../services/user/user_update`)
const deleteUserProfile = require(`../services/user/user_delete`)


router.get(`/`, (req, res) => getUserProfile(req, res))
router.post(`/`, (req, res) => registerUser(res, req.body))
router.patch(`/`, (req, res) => updateUserProfile(req, res))
router.delete(`/`, (req, res) => deleteUserProfile(req, res))

module.exports = router
