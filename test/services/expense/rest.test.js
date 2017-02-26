'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
const app = require('../../../src/app')
const Expense = app.service('expenses')
const User = app.service('users')
const authentication = require('feathers-authentication/client')
const bodyParser = require('body-parser')
var token, userId, date, expenseId

// config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication())
// use http plugin
chai.use(chaiHttp)
// use should
var should = chai.should()

describe('REST expense service', () => {
  before((done) => {
    date = (new Date()).getTime()
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

  it('should create the expense data', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .post('/expenses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
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
        expenseId = res.body._id

        res.body.should.have.property('owner')
        res.body.owner.should.equal(userId)

        res.body.should.have.property('date')
        res.body.date.should.equal(date)

        res.body.should.have.property('description')
        res.body.description.should.equal('Something')

        res.body.should.have.property('amount')
        res.body.amount.should.equal(99.90)

        res.body.should.have.property('comment')
        res.body.comment.should.equal('Some long comment')
        done()
      })
  })

  it('should create another the expense data', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .post('/expenses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
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
        res.body._id.should.not.equal(expenseId)
        done()
      })
  })

  it('should get list of expenses', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.body.should.have.property('total')
        res.body.total.should.equal(2)

        res.body.should.have.property('limit')
        res.body.limit.should.equal(5)

        res.body.should.have.property('skip')
        res.body.skip.should.equal(0)

        res.body.should.have.property('data')
        res.body.data.should.have.lengthOf(2)
        done()
      })
  })

  it('should get the expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses/' + expenseId)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.body._id.should.equal(expenseId)
        done()
      })
  })

  it('should update the expense', (done) => {
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
        res.body.should.have.property('description')
        res.body.description.should.equal('Something')

        res.body.should.have.property('amount')
        res.body.amount.should.equal(9.90)
        done()
      })
  })

  it('should delete the expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .delete('/expenses/' + expenseId)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.statusCode.should.equal(200)
        done()
      })
  })

  it('should now only give single expense', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.body.should.have.property('total')
        res.body.total.should.equal(1)

        res.body.should.have.property('data')
        res.body.data.should.have.lengthOf(1)
        done()
      })
  })
})
