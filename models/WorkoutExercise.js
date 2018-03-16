const sequelize = require(`sequelize`)
const db = require(`../server/initDatabase`)

const WorkoutExercise = () => {
  const schema = db.define(`workoutexercises`, {
    workoutexercise_id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      unique: true
    },
    workoutplan_id: {
      type: sequelize.UUID,
      unique: false
    },
    exercise_id: {
      type: sequelize.UUID,
      unique: false
    },
    user_id: {
      type: sequelize.UUID,
      unique: false
    },
    weight: {
      type: sequelize.FLOAT
    },
    repetition: {
      type: sequelize.INTEGER
    }
  })

  return schema
}

module.exports = WorkoutExercise()
