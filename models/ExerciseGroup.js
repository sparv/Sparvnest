const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const ExerciseGroup = () => {
  const schema = db.define(`exercisegroups`, {
    exercisegroup_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4
    },
    name: {
      type: sequelize.STRING
    },
    description: {
      type: sequelize.STRING
    }
  })

  return schema
}
