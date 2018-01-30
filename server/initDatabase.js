const sequelize = require(`sequelize`)
const config = require(`./config.json`)

const initializeDatabase = () => {
  const db = new sequelize(config.db.database, config.db.user, config.db.pass, {
    host: config.db.host,
    dialect: `postgres`,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  })

  db.authenticate()
    .catch((err) => {
      console.log(err)
    })

  return db
}

module.exports = initializeDatabase()
