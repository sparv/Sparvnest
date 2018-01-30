const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const ExerciseMap = () => {
  const schema = db.define(`exercisemap`, {})

  return schema
}

module.exports = ExerciseMap()
