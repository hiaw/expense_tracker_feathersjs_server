const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
const app = require('../../../src/app')
const Expense = app.service('expenses')
const User = app.service('users')
const authentication = require('feathers-authentication/client')
const bodyParser = require('body-parser')
var token, userToken, userId, date, expenseId

// config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication())
// use http plugin
chai.use(chaiHttp)
// use should
var should = chai.should()

function createManagerUser (done) {
  User.create({
    'email': 'resposmanager',
    'password': 'igzSwi7*Creif4V$',
    'roles': ['manager']
  }, (res) => {
    // setup a request to get authentication token
    chai.request(app)
    // request to /auth/local
      .post('/auth/local')
    // set header
      .set('Accept', 'application/json')
    // send credentials
      .send({
        'email': 'resposmanager',
        'password': 'igzSwi7*Creif4V$'
      })
    // when finished
      .end((err, res) => {
        // set token for auth in other requests
        token = res.body.token
        done()
      })
  })
}

describe('REST as Manager expense service', () => {
  before((done) => {
    date = (new Date()).getTime()
    // start the server
    this.server = app.listen(3030)
    // once listening do the following
    this.server.once('listening', () => {
      // create mock user
      User.create({
        'email': 'user@user.com',
        'password': 'igzSwi7*Creif4V$'
      }, (res) => {
        // setup a request to get authentication token
        chai.request(app)
        // request to /auth/local
          .post('/auth/local')
        // set header
          .set('Accept', 'application/json')
        // send credentials
          .send({
            'email': 'user@user.com',
            'password': 'igzSwi7*Creif4V$'
          })
        // when finished
          .end((err, res) => {
            // set token for auth in other requests
            userId = res.body.data._id
            userToken = res.body.token
            createManagerUser(done)
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

  it('should create another the expense data', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .post('/expenses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(userToken))
    // attach data to request
      .send({
        owner: userId,
        date: date,
        description: 'Something',
        amount: 99.90,
        comment: 'Some long comment'
      })
    // when finished do the following
      .end((err, res) => {
        res.body.should.have.property('createdAt')
        res.body.should.have.property('updatedAt')

        expenseId = res.body._id
        res.body.date.should.equal(date)
        done()
      })
  })

  it('should not get the expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses/' + expenseId)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.statusCode.should.equal(403)
        done()
      })
  })

  it('should not update the expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .patch('/expenses/' + expenseId)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // attach data to request
      .send({
        amount: 9.90
      })
    // when finished do the following
      .end((err, res) => {
        res.statusCode.should.equal(403)
        done()
      })
  })

  it('should not delete the expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .delete('/expenses/' + expenseId)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.statusCode.should.equal(403)
        done()
      })
  })
})
