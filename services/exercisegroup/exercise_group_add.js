const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGroupAdd = require(`../../lib/exercisegroup/exerciseGroupAdd`)

const config = require(`../../server/config`)

function addingExerciseGroupToDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_add.requestHeader)
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
            Joi.validate(request.body, schema.exercise_group_add.requestBody)
              .then(() => {
                const data = request.body

                exerciseGroupAdd({
                  name: data.name,
                  description: data.description,
                  exercises: []
                })
                  .then(info => {
                    resolve(response
                      .status(200)
                      .send({
                        message: info.message,
                        exercisegroup: info.exercisegroup
                      }))
                  })
                  .catch(info => {
                    reject(response
                      .status(500)
                      .send({
                        message: info.message
                      }))
                  })
              })
          }
        })
      })
  })
}

module.exports = addingExerciseGroupToDatabase
