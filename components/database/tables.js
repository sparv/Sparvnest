const sequelize = require(`sequelize`)

const tables = {
	User: function (db) {
		const schema = db.define(`users`, {
			email: {
				type: sequelize.STRING,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: sequelize.TEXT
			},
			salt: {
				type: sequelize.STRING
			}
		})

		return schema
	}
}

module.exports = tables