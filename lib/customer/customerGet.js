const Customer = require(`../../models/Customer`)

const customerGet = (relationId, customerId) => {
  return new Promise((resolve, reject) => {
    Customer.findOne({ where: {
      customer_id: customerId,
      user_id: relationId
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
            name: `ResourceError`,
            message: `User with this ID not found`
          })
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

module.exports = customerGet
