const Users = require(`../../models/User`)

const userGet = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Users.findOne({ where: { email: decodeURIComponent(email).toLowerCase() }})

      //should return a clean first level object without property "user"
      resolve({
        user: {
          user_id: user.user_id,
          email: user.email,
          forename: user.forename,
          surname: user.surname,
          password: user.password,
          salt: user.salt
        }
      })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = userGet
