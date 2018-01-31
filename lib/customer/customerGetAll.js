const Customer = require(`../../models/Customer`)

const customerGetAll = (relationId) => {
  return new Promise((resolve, reject) => {
    Customer.findAll({ where: { relation_id: relationId } })
      .then(customers => {
        const customerMap = customers.map(customer => {
          return {
            customer_id: customer.customer_id,
            forename: customer.forename,
            surname: customer.surname,
            phone: customer.phone,
            email: customer.email
          }
        })

        resolve({
          status: 200,
          customer_list: customerMap
        })
      })
      .catch(error => {
        console.error(error)
        reject({
          status: 404,
          message: `Customer List not found`
        })
      })
  })
}

module.exports = customerGetAll
