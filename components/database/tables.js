const sequelize = require(`sequelize`)

const tables = {
  Users: function (db) {
    const schemaUser = db.define(`users`, {
      relation_id: {
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

    return schemaUser
  },
  Customers: function (db) {
    const schemaCustomers = db.define(`customers`, {
      email: {
        type: sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      forename: {
        type: sequelize.STRING
      },
      surname: {
        type: sequelize.STRING
      },
      phone: {
        type: sequelize.STRING
      },
      gender: {
        type: sequelize.STRING
      },
      age: {
        type: sequelize.STRING
      },
      notes: {
        type: sequelize.STRING
      },
      relation_id: {
        type: sequelize.STRING
      },
      customer_id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4
      }
    })

    return schemaCustomers
  }
}

module.exports = tables
