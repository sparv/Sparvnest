const passport = require(`passport`)

function userSession (dbTable) {
	passport.serializeUser((user, done) => {
		done(null, user.email)
	})

	passport.deserializeUser((username, done) => {
		dbTable.findOne({ where: { email: username } })
			.then((user) => {
				done(user.email)
			})
	})
}

module.exports = userSession
