const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupUpdate = (exerciseGroupId, relationId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await ExerciseGroup.update(data, { where: {
        exercisegroup_id: exerciseGroupId,
        user_id: relationId
      }})

      if (update === 0) reject({
        name: `ResourceError`,
        message: `Exercisegroup was not updated`
      })

      resolve({ message: `Exercisegroup updated` })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = exerciseGroupUpdate
