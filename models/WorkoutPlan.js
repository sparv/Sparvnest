const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const WorkoutPlan = () => {
  const schema = db.define(`workoutplans`, {
    workoutplan_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      unique: true
    },
    customer_id: {
      type: sequelize.UUID,
      unique: false
    },
    title: {
      type: sequelize.STRING
    },
    description: {
      type: sequelize.STRING
    }
  })

  return schema
}

module.exports = WorkoutPlan()
