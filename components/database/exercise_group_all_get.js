const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseGroupAllGet (request, response, tableExerciseGroups, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_all_get)
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
            tableExerciseGroups.findAll()
              .then(exerciseGroups => {
                const exerciseGroupsList = exerciseGroups.map(group => {
                  return {
                    exercisegroup_id: group.exercisegroup_id,
                    name: group.name,
                    description: group.description
                  }
                })

                resolve(response
                  .status(200)
                  .send({
                    exercise_groups_list: exerciseGroupsList
                  }))
              })
              .catch(error => {
                console.log(error)

                reject(response
                  .status(500)
                  .send({
                    message: `Exercise group list could not be fetched`
                  }))
              })
          }
        })
      })
  })
}

module.exports = exerciseGroupAllGet