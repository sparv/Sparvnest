const routes = (server) => {
  const endpoints = {
    authentication: require(`./authentication`),
    customers: require(`./customers`),
    exercisegroups: require(`./exercisegroups`),
    users: require(`./users`),
    reset: require(`./reset`)
  }

  Object.keys(endpoints).forEach(endpoint => {
    server.use(`/${endpoint}`, endpoints[endpoint])
  })
}

module.exports = routes
