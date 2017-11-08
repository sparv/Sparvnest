const test = require(`ava`)
const config = require(`../../config.json`)
const init = require(`./init`)

test(`initialization of database`, t => {
  const db = init(config)

  if (typeof db === `object`) {
    t.pass()
  } else {
    t.fail()
  }
})
