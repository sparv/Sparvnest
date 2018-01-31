const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

function exerciseGroupExerciseAdd (request, response, tableExerciseGroups, tableExercises, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_exercise_add.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (error, verification) => {
          if (error) {
            console.log(error)

            if (error.name === `TokenExpiredError`) {
              reject(response
                .status(510)
                .send({
                  message: `JWT token expired`
                }))
            } else {
              reject(response
                .status(401)
                .send({
                  message: `JWT authentication failed`
                }))
            }
          } else {
            const { exerciseId, exerciseGroupId } = request.params
            Joi.validate({exercisegroup_id: exerciseGroupId, exercise_id: exerciseId}, schema.exercise_group_exercise_add.requestParams)
              .then(() => {
                tableExerciseGroups.findOne({ where: {
                  exercisegroup_id: exerciseGroupId
                } })
                  .then(exerciseGroup => {
                    tableExercises.findOne({ where: {
                      exercise_id: exerciseId
                    } })
                      .then(exercise => {
                        return exerciseGroup.addExercise(exercise)
                      })
                      .then(result => {
                        if (result.length < 1) {
                          reject(response
                            .status(400)
                            .send({
                              message: `exercise already added to group`
                            }))
                        } else {
                          resolve(response
                            .status(200)
                            .send({
                              message: `exercise added to group`
                            }))
                        }
                      })
                  })
              })
              .catch(error => {
                console.log(error)
                reject(response
                  .status(500)
                  .send({
                    message: `internal server error`
                  }))
              })
          }
        })
      })
  })

}

module.exports = exerciseGroupExerciseAdd
