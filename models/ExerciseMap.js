const sequelize = require(`sequelize`)

const ExerciseMap = (db) => {
  const schema = db.define(`exercisemap`, {})

  return schema
}

module.exports = ExerciseMap
