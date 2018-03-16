const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../helper/hash_password`)

const User = require(`../../models/User`)

const userUpdate = (relationId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.email !== undefined) {
        const userEmail = data.email.toLowerCase()
        delete data.email
        data[`email`] = userEmail
      }

      const affectedRows = await User.update(data, { where: { user_id: relationId } })

      if (affectedRows === 0) {
        reject({
          status: 500,
          message: `[ERROR] User was not updated`
        })
      }

      resolve()
    } catch (error) {
      reject({
        status: 500,
        message: error
      })
    }
  })
}

module.exports = userUpdate
