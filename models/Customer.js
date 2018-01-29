const sequelize = require(`sequelize`)

const Customer = (db) => {
  const schema = db.define(`customers`, {
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

  return schema
}

module.exports = Customer
