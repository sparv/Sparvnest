const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const Exercise = require(`./Exercise`)

const ExerciseGroup = () => {
  const schema = db.define(`exercisegroups`, {
    exercisegroup_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      unique: true
    },
    name: {
      type: sequelize.STRING
    },
    description: {
      type: sequelize.STRING
    },
    relation_id: {
      type: sequelize.UUID
    }
  })

  return schema
}

module.exports = ExerciseGroup()
