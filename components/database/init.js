const sequelize = require(`sequelize`)

function initializeDatabase (config) {
	const db = new sequelize(config.db.database, config.db.user, config.db.pass, {
		host: config.db.host,
		dialect: `postgres`,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	})

	db.authenticate()
		.then(() => {
			console.log(`Database authentication successful`)
		})
		.catch((err) => {
			console.log(err)
		})

	return db
}

module.exports = initializeDatabase
