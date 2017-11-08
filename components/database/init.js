const Sequelize = require(`sequelize`)

function initializeDatabase (config) {
  const db = new Sequelize(config.db.database, config.db.user, config.db.pass, {
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

module.exports = initializeDatabase
