const Customer = require(`../../models/Customer`)

const customerAdd = (relationId, userData) => {
  return new Promise((resolve, reject) => {
    Customer.findOne({ where: {
      email: userData.email,
      relation_id: relationId
    } })
      .then(customer => {
        if (customer) {
          reject({
            status: 400,
            message: `customer already added`
          })
        } else {
          Customer.create({
            relation_id: relationId,
            forename: userData.forename,
            surname: userData.surname,
            email: userData.email,
            phone: userData.phone,
            gender: userData.gender,
            age: userData.age,
            notes: userData.notes
          }).then(customer => {
            resolve({
              status: 200,
              message: `Customer added`,
              customer: {
                id: customer.customer_id,
                forename: customer.forename,
                surname: customer.surname,
                email: customer.email,
                phone: customer.phone,
                gender: customer.gender,
                age: customer.age
              }
            })
          }).catch(error => {
            console.error(error)
            reject({
              status: 500,
              message: error
            })
          })
        }
      })
      .catch(error => {
        console.log(error)
        reject({
          status: 500,
          message: `[${error.name}] ${error.details[0].message}`
        })
      })
  })
}

module.exports = customerAdd
