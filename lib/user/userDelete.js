const User = require(`../../models/User`)

const userDelete = (relationId) => {
  return new Promise((resolve, reject) => {
    User.destroy({ where: { relation_id: relationId } })
      .then(user => {
        resolve({
          status: 200,
          message: `User deleted`
        })
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

module.exports = userDelete
