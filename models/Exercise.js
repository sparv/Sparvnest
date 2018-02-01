const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const ExerciseGroup = require(`./ExerciseGroup`)

const Exercise = () => {
  const schema = db.define(`exercises`, {
    exercise_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      unique: true
    },
    name: {
      type: sequelize.STRING
    },
    level: {
      type: sequelize.STRING
    },
    description: {
      type: sequelize.STRING
    },
    exercisegroup_id: {
      type: sequelize.UUID,
      unique: true
    }
  })

  return schema
}

module.exports = Exercise()
