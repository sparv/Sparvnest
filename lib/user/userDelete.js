const User = require(`../../models/User`)

const userDelete = (relationId) => {
  return new Promise((resolve, reject) => {
    User.destroy({ where: { relation_id: relationId } })
      .then(resolve())
      .catch(error => {
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = userDelete
