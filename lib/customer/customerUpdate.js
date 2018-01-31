const Customer = require(`../../models/Customer`)

const customerUpdate = (customerId, updateData) => {
  return new Promise((resolve, reject) => {
    Customer.update(updateData, {
      where: { id: customerId } })
      .then(() => {
        resolve({
          status: 200,
          message: `Customer updated`
        })
      })
      .catch(error => {
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = customerUpdate
