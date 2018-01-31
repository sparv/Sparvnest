const Customer = require(`../../models/Customer`)

const customerUpdate = (customerId, updateData) => {
  return new Promise((resolve, reject) => {
    Customer.update(updateData, {
      where: { customer_id: customerId } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 500,
            message: `Customer was not updated`
          })
        } else {
          resolve({
            status: 200,
            message: `Customer updated`
          })
        }
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
