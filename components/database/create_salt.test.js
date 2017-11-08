const test = require(`ava`)
const createSalt = require(`./create_salt`)

test(`generating salt as string`, t => {
  const salt = createSalt()

  if (typeof salt === `string`) {
    t.pass()
  } else {
    t.fail()
  }
})
