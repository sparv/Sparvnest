const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupGetAll = () => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findAll()
      .then(exercisegroups => {
        const exercisegroupList = exercisegroups.map(exercisegroup => {
          return {
            exercisegroup_id: exercisegroup.exercisegroup_id,
            name: exercisegroup.name,
            description: exercisegroup.description
          }
        })

        resolve({
          status: 200,
          exercisegroup_list: exercisegroupList
        })
      })
      .catch(error => {
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupGetAll
