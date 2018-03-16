const User = require(`../../models/User`)

const userDelete = (relationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.destroy({ where: { user_id: relationId } })
      resolve()
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = userDelete
