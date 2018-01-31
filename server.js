const express = require(`express`)
const passport = require(`passport`)
const bodyParser = require(`body-parser`)

const routes = require(`./routes`)

const config = require(`./server/config.json`)

const server = express()

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(passport.initialize())
server.use((req, res, next) => {
  res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
  res.append(`Access-Control-Allow-Headers`, [`Authorization`, `Content-Type`])
  res.append(`Access-Control-Allow-Methods`, ['GET, POST, PUT, DELETE, OPTIONS'])
  next()
})

routes(server)

server.listen(config.port, () => console.log(`Running on port ${config.port}`))
