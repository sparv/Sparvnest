const express = require(`express`)
const router = express.Router()

const login = require(`../services/authentication/login`)
const tokenRefresh = require(`../lib/helper/token_refresh`)

const config = require(`../server/config`)

router.post(`/`, (req, res) => {
  login(req, res)
    .catch(error => console.error(error))
})

router.put(`/`, (req, res) => {
  tokenRefresh(req, res, config)
    .catch(error => console.error(error))
})

module.exports = router
