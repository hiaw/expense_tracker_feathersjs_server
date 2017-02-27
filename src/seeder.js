const faker = require('faker')
const moment = require('moment')

let count = 0

function generateEmails () {
  let users = ['admin', 'manager', 'user1', 'user2']
  let email = users[count] + '@test.com'
  count += 1
  return email
}

function generateRoles () {
  let roles = ['admin', 'manager']
  return [roles[count]]
}

function removeAll (app) {
  let Expense = app.service('expenses')
  let User = app.service('users')
  Expense.remove(null, () => {
    User.remove(null, () => {
      createUser(app)
    })
  })
}

function createUser (app) {
  for (var i = 0; i < 4; i++) {
    app.service('users').create({
      roles: generateRoles(),
      email: generateEmails(),
      password: '123456'
    }).then(user => {
      createExpensesForUser(user._id, app)
    })
  }
}

function generateRandomDateFromPastMonth () {
  let millisecForAMonth = 1000 * 60 * 60 * 24 * 30
  let millisecDiff = Math.round(millisecForAMonth * Math.random())
  return moment(moment().valueOf() - millisecDiff).toDate()
}

function createExpensesForUser (userId, app) {
  for (var i = 0; i < 50; i++) {
    app.service('expenses').create({
      owner: userId,
      date: generateRandomDateFromPastMonth(),
      description: faker.company.catchPhraseDescriptor(),
      amount: Math.round(10000 * Math.random()) / 100,
      comment: faker.lorem.sentence()
    })
  }
}

function seed (app) {
  removeAll(app)
}

module.exports = seed
