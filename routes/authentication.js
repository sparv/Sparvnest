const express = require(`express`)
const router = express.Router()

const login = require(`../services/authentication/login`)
const tokenRefresh = require(`../lib/helper/token_refresh`)

router.post(`/`, (req, res) => login(req, res))
router.get(`/`, (req, res) => tokenRefresh(req, res))

module.exports = router
