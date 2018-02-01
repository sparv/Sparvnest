const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseAdd = require(`../../lib/exercise/exerciseAdd`)

const config = require(`../../server/config`)

function exerciseGroupExerciseAdd (request, response) {
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
            const { exercisegroupId } = request.params
            Joi.validate({ exercisegroup_id: exercisegroupId }, schema.exercise_group_exercise_add.requestParams)
              .then(() => {
                exerciseAdd(exercisegroupId, request.body)
                  .then(info => {
                    resolve(response
                      .status(200)
                      .send({
                        message: info.message,
                        exercise: info.exercise
                      })
                    )
                  })
                  .catch(info => {
                    console.error(info.message)
                    reject(response
                      .status(500)
                      .send({ message: info.message })
                    )
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
