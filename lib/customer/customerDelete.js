const Customer = require(`../../models/Customer`)

const customerDelete = (relationId, customerId, customerSurname) => {
  return new Promise((resolve, reject) => {
    Customer.destroy({ where: {
      customer_id: customerId,
      relation_id: relationId,
      surname: customerSurname
    } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 400,
            message: `No Customer deleted`
          })
        } else {
          resolve({
            status: 200,
            message: `Customer deleted`
          })
        }
      })
      .catch(error => {
        console.error(error)
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = customerDelete
