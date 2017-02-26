'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
const app = require('../../../src/app')
const Expense = app.service('expenses')
const User = app.service('users')
const authentication = require('feathers-authentication/client')
const bodyParser = require('body-parser')
var token, userId, date

// config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication())
// use http plugin
chai.use(chaiHttp)

describe('expense service', () => {
  before((done) => {
    // start the server
    this.server = app.listen(3030)
    // once listening do the following
    this.server.once('listening', () => {
      // create mock user
      User.create({
        'email': 'resposadmin',
        'password': 'igzSwi7*Creif4V$',
        'roles': ['admin']
      }, (res) => {
        // setup a request to get authentication token
        chai.request(app)
        // request to /auth/local
          .post('/auth/local')
        // set header
          .set('Accept', 'application/json')
        // send credentials
          .send({
            'email': 'resposadmin',
            'password': 'igzSwi7*Creif4V$'
          })
        // when finished
          .end((err, res) => {
            // set token for auth in other requests
            token = res.body.token
            userId = res.body.data._id
            done()
          })
      })
    })
  })

  // teardown after tests
  after((done) => {
    // delete contents of menu in mongodb
    Expense.remove(null, () => {
      User.remove(null, () => {
        // stop the server
        this.server.close(function () {})
        done()
      })
    })
  })

  it('registered the expenses service', () => {
    assert.ok(app.service('expenses'))
  })

  it('runs create', (done) => {
    date = (new Date()).getTime()
    app.service('expenses').create({
      owner: userId,
      date: date,
      description: 'Something2',
      amount: 99.90,
      comment: 'Some long comment'
    }).then(expense => {
      assert.ok(expense._id)
      assert.equal(expense.owner, userId)
      assert.equal(expense.date, date)
      assert.equal(expense.description, 'Something2')
      assert.equal(expense.amount, 99.90)
      assert.equal(expense.comment, 'Some long comment')
      done()
    })
  })
  /* it('runs create', () => {
   *   app.service('expenses').patch({
   *     date: (new Date()).getTime(),
   *     description: 'Something',
   *     amount: 99.90,
   *     comment: 'Some long comment'
   *   }).then(expense => {
   *     assert.ok(expense._id)
   *     assert.equal(expense.description, 'Something')
   *     assert.equal(expense.amount, 99.90)
   *     assert.equal(expense.comment, 'Some long comment')
   *   })
   * }) */
})
