const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGroupGetAll = require(`../../lib/exercisegroup/exerciseGroupGetAll`)

const config = require(`../../server/config`)

function exerciseGroupAllGet (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_all_get.requestHeader)
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
            exerciseGroupGetAll()
              .then(info => {
                resolve(response
                  .status(info.status)
                  .send({
                    exercise_groups_list: info.exercisegroup_list
                  }))
              })
              .catch(error => {
                console.error(error)

                reject(response
                  .status(500)
                  .send({
                    message: `Exercise group list could not be fetched`
                  }))
              })
          }
        })
      })
      .catch(error => {
        console.error(error)

        reject(response
          .status(500)
          .send({
            message: `Exercise group list could not be fetched`
          }))
      })
  })
}

module.exports = exerciseGroupAllGet
