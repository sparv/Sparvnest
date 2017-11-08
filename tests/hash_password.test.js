const test = require(`ava`)
const hashPassword = require(`../components/database/hash_password`)

test(`Return hashed password`, t => {
  const salt = `foobarsaltysalt`
  const passwordString = `123testpw`

  const hashedPassword = hashPassword(passwordString, salt)

  if (typeof hashedPassword === `string`) {
    t.pass()
  } else {
    t.fail()
  }
})
