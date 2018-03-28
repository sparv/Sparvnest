const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupGetAll = (relationId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findAll({ where: { user_id: relationId } })
      .then(exercisegroups => {
        const exercisegroupList = exercisegroups.map(exercisegroup => {
          return {
            exercisegroup_id: exercisegroup.exercisegroup_id,
            name: exercisegroup.name,
            description: exercisegroup.description,
            color: exercisegroup.color
          }
        })

        resolve({ exercisegroup_list: exercisegroupList })
      })
      .catch(error => {
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupGetAll
