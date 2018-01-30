function routing (server, tableUsers, tableCustomers, tableExercises, tableExerciseGroups, tableExerciseMap, config) {
 // DEBUGGING PURPOSE ONLY
  server.get(`/resetDB`, (req, res) => {
    tableUsers.sync({force: true})
    tableCustomers.sync({force: true})
    tableExercises.sync({force: true})
    tableExerciseGroups.sync({force: true})
    .then(() => {
      tableExerciseMap.sync({force: true})
    })
    .then(() => {
      res.send(`db reset`)
      res.end()
    })
  })
}

module.exports = routing
