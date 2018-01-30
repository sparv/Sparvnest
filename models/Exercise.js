const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const Exercise = () => {
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

module.exports = Exercise()
