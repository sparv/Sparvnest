const express = require(`express`)
const router = express.Router()

const customerAllGet = require(`../services/customer/customer_all_get`)
const customerGet = require(`../services/customer/customer_get`)
const customerAdd = require(`../services/customer/customer_add`)
const customerUpdate = require(`../services/customer/customer_update`)
const customerDelete = require(`../services/customer/customer_delete`)

const config = require(`../server/config`)

router.get(`/`, (req, res) => {
  customerAllGet(req, res, config)
    .then(() => console.log(`[STATUS] Customer list gathered`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

router.get(`/:customerId`, (req, res) => {
  customerGet(req, res, config)
    .then(() => console.log(`[STATUS] Customer gathered`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

router.post(`/`, (req, res) => {
  customerAdd(req, res, config)
    .then(() => console.log(`[STATUS] Customer added`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

router.put(`/:customerId`, (req, res) => {
  customerUpdate(req, res, config)
    .then(() => console.log(`[STATUS] Customer updated`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

router.delete(`/:customerId`, (req, res) => {
  customerDelete(req, res, config)
    .then(() => console.log(`[STATUS] Customer deleted`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

module.exports = router
