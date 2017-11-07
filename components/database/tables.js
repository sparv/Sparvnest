const sequelize = require(`sequelize`)

const tables = {
  User: function (db) {
    const schema = db.define(`users`, {
      uuid: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4
      },
      email: {
        type: sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: sequelize.TEXT
      },
      salt: {
        type: sequelize.STRING
      },
      forename: {
        type: sequelize.STRING
      },
      surname: {
        type: sequelize.STRING
      }
    })

    return schema
  }
}

module.exports = tables
