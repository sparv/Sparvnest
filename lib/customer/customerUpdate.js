const Customer = require(`../../models/Customer`)

const customerUpdate = (customerId, updateData) => {
  return new Promise((resolve, reject) => {
    Customer.update(updateData, {
      where: { customer_id: customerId } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            name: `ResourceError`,
            message: `Customer was not updated`
          })
        } else {
          resolve({ message: `Customer updated` })
        }
      })
      .catch(error => {
        reject({
          name: `DatabaseErrro`,
          message: error
        })
      })
  })
}

module.exports = customerUpdate
