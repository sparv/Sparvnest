const Customer = require(`../../models/Customer`)

const customerGet = (relationId, customerId) => {
  return new Promise((resolve, reject) => {
    Customer.findOne({ where: {
      customer_id: customerId,
      relation_id: relationId
    } })
      .then(customer => {
        if (customer !== null) {
          resolve({
            status: 200,
            customer: {
              customer_id: customer.customer_id,
              forename: customer.forename,
              surname: customer.surname,
              phone: customer.phone,
              email: customer.email,
              gender: customer.gender,
              age: customer.age,
              notes: customer.notes,
              dates: [],
              trainingplans: []
            }
          })
        } else {
          reject({
            status: 404,
            message: `User with this ID not found`
          })
        }
      })
      .catch(error => {
        console.error(error)
        reject({
          status: 500,
          message: `Internal DB error`
        })
      })
  })
}

module.exports = customerGet
