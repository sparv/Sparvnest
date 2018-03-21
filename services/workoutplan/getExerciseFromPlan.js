const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutexerciseGet = require(`../../lib/workoutexercise/workoutexerciseGet`)
const exerciseGet = require(`../../lib/exercise/exerciseGet`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()

const getExerciseFromPlan = async (request, response) => {
  try {
    const workoutexerciseId = request.params.workoutexerciseId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateParams = await Joi.validate(workoutexerciseId, schemaParams)

    const gatheringWorkoutexercise = await workoutexerciseGet(workoutexerciseId, validationToken.user_id)
    const gatheringExercise = await exerciseGet(gatheringWorkoutexercise.workoutexercise.exercise_id)


    return response
      .status(200)
      .send({
        workoutexercise_id: gatheringWorkoutexercise.workoutexercise.workoutexercise_id,
        name: gatheringExercise.exercise.name,
        level: gatheringExercise.exercise.level,
        description: gatheringExercise.exercise.description,
        weight: gatheringWorkoutexercise.workoutexercise.weight,
        repetition: gatheringWorkoutexercise.workoutexercise.repetition
      })
  } catch (error) {
    console.log(error)
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = getExerciseFromPlan
