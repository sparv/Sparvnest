const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseGroupGet (request, response, tableExerciseGroups, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_get.requestHeader)
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
            const exerciseGroupId = request.params.exerciseGroupId

            Joi.validate({exercisegroup_id: exerciseGroupId}, schema.exercise_group_get.requestParams)
              .then(() => {
                tableExerciseGroups.findOne({ where: {
                  exercisegroup_id: exerciseGroupId
                } })
                  .then(exerciseGroup => {
                    if (exerciseGroup === null) {
                      reject(response
                        .status(404)
                        .send({
                          message: `Exercisegroup not found`
                        }))
                    } else {
                      resolve(response
                        .status(200)
                        .send({
                          exercisegroup_id: exerciseGroup.exercisegroup_id,
                          name: exerciseGroup.name,
                          description: exerciseGroup.description
                        }))
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    reject(response
                      .status(500)
                      .send({
                        message: `[${error.name}] ${error.details[0].message}`
                      }))
                  })
              })
          }
        })
        .catch(error => {
          console.log(error)

          reject(response
            .status(401)
            .send({
              message: `[${error.name}] ${error.details[0].message}`
            }))
        })
      })
  })
}

module.exports = exerciseGroupGet
