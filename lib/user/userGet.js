const Users = require(`../../models/User`)

const userGet = (relationId) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ where: { relation_id: relationId } })
      .then(user => {
        resolve({
          user: {
            relation_id: user.relation_id,
            email: user.email,
            forename: user.forename,
            surname: user.surname,
            password: user.password,
            salt: user.salt
          }
        })
      })
      .catch(error => reject({
        name: `DatabaseError`,
        message: error
      }))
  })
}

module.exports = userGet
