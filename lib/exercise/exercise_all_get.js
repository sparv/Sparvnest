const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

function exerciseAllGet (request, response, tableExercises, config) {
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
            tableExercises.findAll()
              .then(exercises => {
                const exerciseList = exercises.map(exercise => {
                  return {
                    exercise_id: exercise.exercise_id,
                    name: exercise.name,
                    level: exercise.level,
                    description: exercise.description
                  }
                })

                resolve(response
                  .status(200)
                  .send({
                    exercise_list: exerciseList
                  }))
              })
              .catch(error => {
                console.log(error)

                reject(response
                  .status(500)
                  .send({
                    message: `Exerciselist could not be fetched`
                  }))
              })
          }
        })
      })
  })
}

module.exports = exerciseAllGet
