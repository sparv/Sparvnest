const errorMap = (error) => {
  switch (error.name) {
    case `TokenExpiredError`:
      return {
        status: 401,
        name: error.name,
        message: error.message
      }
      break;
    case `JsonWebTokenError`:
      return {
        status: 400,
        name: error.name,
        message: error.message
      }
      break;
    case `ValidationError`:
      //error.details.message here because joi formats the error object like this
      return {
        status: 403,
        name: error.name,
        message: error.details.message
      }
      break;
    case `DatabaseError`:
      const message = error.message.toString()
      return {
        status: 500,
        name: error.name,
        message: message
      }
      break;
    case `UserCredentialsError`:
      return {
        status: 401,
        name: error.name,
        message: error.message
      }
      break;
    case `ConflictError`:
      return {
        status: 409,
        name: error.name,
        message: error.message
      }
      break;
    case `ResourceError`:
      return {
        status: 404,
        name: error.name,
        message: error.message
      }
      break;
  }
}

module.exports = errorMap
