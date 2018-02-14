const errorMap = (error) => {
  switch (error.name) {
    case `TokenExpiredError`:
      return {
        status: 401,
        message: error.message
      }
      break;
    case `JsonWebTokenError`:
      return {
        status: 400,
        message: error.message
      }
      break;
    case `ValidationError`:
      //error.details.message here because joi formats the error object like this
      return {
        status: 403,
        message: error.details.message
      }
      break;
    case `DatabaseError`:
      const message = error.message.toString()
      return {
        status: 500,
        message: message
      }
      break;
    case `UserCredentialsError`:
      return {
        status: 401,
        message: error.message
      }
      break;
    default:
      return {
        status: 500,
        message: error.message
      }
      break;
  }
}

module.exports = errorMap
