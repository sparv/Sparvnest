const crypto = require(`crypto`)

function userRegistration (dbTable, data, callback) {
	dbTable.findOne({ where: { email: data.email } })
		.then((user) => {
			if (user) {
				console.log(`User already registered`)
				callback(false)
			} else {
				const salt = crypto.randomBytes(128).toString(`base64`)
				const hash = crypto.pbkdf2Sync(data.password, salt, 100000, 512, `sha512`).toString(`base64`)

				dbTable.create({
					email: data.email,
					password: hash,
					salt: salt
				})
				.then((user) => {
					console.log(`User ${user.email} created`)
					callback(true, user.email)
				})
			}
		})
		.catch((err) => {
			console.error(`Database error:`, err)
		})
}

module.exports = userRegistration
