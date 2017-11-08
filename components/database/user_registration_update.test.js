const test = require(`ava`)

const userRegistration = require(`./user_registration`)
const userUpdate = require(`./user_update`)

const initDb = require(`../database/init`)
const tables = require(`../database/tables`)
const config = require(`../../config.json`)

const db = initDb(config)
const tableUsers = tables.Users(db)
const reqBody = {
  "email": "unittest@test.test",
  "password": "testpassword",
  "forename": "test",
  "surname": "test"
}

//db testuser cleanup
//
test.before(t => {
  return tableUsers.destroy({
    where: {
      email: reqBody.email
    }
  })
})

test.serial.cb(`Registering User`, t => {
  //Running userReg the first time to create the user entry
  userRegistration(tableUsers, reqBody, (err, success, email) => {
    let emailIsString
    (typeof email === `string`) ? emailIsString = true : emailIsString = false

    if (success && emailIsString) {
      t.pass()
      t.end()
    } else {
      t.fail()
      t.end()
    }
  })
})

test.serial.cb(`Checking if user is already registered`, t => {
  //Running userReg the second time to test if it checks if the user is already registered
  userRegistration(tableUsers, reqBody, (err, success, email) => {
    if (!success) {
      t.pass()
      t.end()
    } else {
      t.fail()
      t.end()
    }
  })
})

const reqBodyUpdate = {
  current: {
    "email": "unittest@test.test",
  },
  update: {
    "email": "updatedunittest@test.test",
    "password": "updatedtestpassword",
  }
}

test.serial.cb(`Updating User`, t => {
  userUpdate(tableUsers, reqBodyUpdate, (user) => {
    if (typeof user === `string`) {
      t.pass()
      t.end()
    } else {
      t.fail()
      t.end()
    }
  })
})
