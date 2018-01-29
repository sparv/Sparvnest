const sequelize = require(`sequelize`)

const Exercise = (db) => {
  const schema = db.define(`exercises`, {
    exercise_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4
    },
    name: {
      type: sequelize.STRING
    },
    level: {
      type: sequelize.STRING
    },
    description: {
      type: sequelize.STRING
    }
  })

  return schema
}

module.exports = Exercise
