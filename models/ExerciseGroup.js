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
    }
  },{
    classMethods: {
      associate: function() {
        schema.hasMany(Exercise)
      }
    }
  })

  schema.hasMany(Exercise, { as: `Items`, foreignKey: `exercisegroup_id`, sourceKey: `exercisegroup_id` })

  return schema
}

module.exports = ExerciseGroup()
