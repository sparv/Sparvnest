const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseDelete = require(`../../lib/exercise/exerciseDelete`)

const config = require(`../../server/config`)

function exerciseGroupExerciseDelete (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_exercise_delete.requestHeader)
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
            const { exerciseId, exercisegroupId } = request.params
            Joi.validate({exercisegroup_id: exercisegroupId, exercise_id: exerciseId}, schema.exercise_group_exercise_delete.requestParams)
              .then(() => {
                exerciseDelete(exerciseId, exercisegroupId)
                  .then(info => {
                    resolve(response
                      .status(200)
                      .send({ message: info.message })
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

module.exports = exerciseGroupExerciseDelete
