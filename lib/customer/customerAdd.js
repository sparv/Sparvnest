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
            name: `ConflictError`,
            message: `Customer already exists in database`
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
              message: `Customer added`,
              customer: { id: customer.customer_id,
                forename: customer.forename,
                surname: customer.surname,
                email: customer.email,
                phone: customer.phone,
                gender: customer.gender,
                age: customer.age
              }
            })
          }).catch(error => {
            reject({
              name: `DatabaseError`,
              message: error
            })
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

module.exports = customerAdd
