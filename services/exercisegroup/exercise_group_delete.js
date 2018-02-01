const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGroupDelete = require(`../../lib/exercisegroup/exerciseGroupDelete`)

const config = require(`../../server/config`)

function deletingExerciseGroupFromDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_delete.requestHeader)
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
            const exerciseGroupId = request.params.exercisegroupId

            console.log(exerciseGroupId)

            Joi.validate({exercisegroup_id: exerciseGroupId}, schema.exercise_group_delete.requestParams)
              .then(() => {
                  exerciseGroupDelete(exerciseGroupId)
                    .then(info => {
                      resolve(response
                        .status(200)
                        .send(info)
                      )
                    })
                    .catch(info => {
                      reject(response
                        .status(500)
                        .send(info)
                      )
                    })
              })
              .catch(error => {
                console.error(error)
                reject(response
                  .status(400)
                  .send({
                    message: `ExerciseGroupID not valid`
                  }))
              })
          }
        })
      })
      .catch(error => {
        console.error(error)
        reject(response
          .status(401)
          .send({
            message: `Request Header not valid`
          }))
      })
  })
}

module.exports = deletingExerciseGroupFromDatabase
