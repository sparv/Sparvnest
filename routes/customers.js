const express = require(`express`)
const router = express.Router()

const customerAllGet = require(`../services/customer/customer_all_get`)
const customerGet = require(`../services/customer/customer_get`)
const customerAdd = require(`../services/customer/customer_add`)
const customerUpdate = require(`../services/customer/customer_update`)
const customerDelete = require(`../services/customer/customer_delete`)

router.get(`/`, (req, res) => customerAllGet(req, res))
router.post(`/`, (req, res) => customerAdd(req, res))
router.get(`/:customerId`, (req, res) => customerGet(req, res))
router.patch(`/:customerId`, (req, res) => customerUpdate(req, res))
router.delete(`/:customerId`, (req, res) => customerDelete(req, res))

module.exports = router
