const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../helper/hash_password`)

const User = require(`../../models/User`)

const userUpdate = (relationId, data) => {
  return new Promise((resolve, reject) => {
    User.update(data, { where: { relation_id: relationId } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 500,
            message: `[ERROR] User was not updated`
          })
        }

        resolve({
          status: 200,
          message: `User data was updated`,
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

module.exports = userUpdate
