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
          console.log(affectedRows)
          reject({
            name: `ConflictError`,
            message: `No Customer deleted`
          })
        } else {
          resolve({ message: `Customer deleted` })
        }
      })
      .catch(error => {
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = customerDelete
