const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseGetAll = require(`../../lib/exercise/exerciseGetAll`)

const config = require(`../../server/config`)

function getAllExercisesFromDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_all_get.requestHeader)
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
            exerciseGroupGet(exercisegroupId, verification.relation_id)
              .then(() => {
                exerciseGetAll(exercisegroupId)
                  .then(info => {
                    resolve(response
                      .status(200)
                      .send({ exercise_list: info.exercise_list })
                    )
                  })
                  .catch(info => {
                    reject(response
                      .status(500)
                      .send({ message: info.message })
                    )
                  })
              })
              .catch(error => {
                reject(response
                  .status(500)
                  .send({ message: info.message})
                )
              })
          }
        })
      })
  })
}

module.exports = getAllExercisesFromDatabase
