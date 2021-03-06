'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../../src/app')
const Expense = app.service('expenses')
const User = app.service('users')
const authentication = require('feathers-authentication/client')
const bodyParser = require('body-parser')
var token, userId

// config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication())
// use http plugin
chai.use(chaiHttp)
// use should
var should = chai.should()

function createSampleData () {
  Expense.create({
    owner: userId,
    date: (new Date(2000, 1, 1)).getTime(),
    description: 'A',
    amount: 1,
    comment: 'Some long comment'
  })
  Expense.create({
    owner: userId,
    date: (new Date(2002, 2, 2)).getTime(),
    description: 'BBBBBBBbbbb',
    amount: 20.99
  })
  Expense.create({
    owner: userId,
    date: (new Date(2005, 5, 5)).getTime(),
    description: 'LLLLllllllll',
    amount: 50,
    comment: 'Some long comment'
  })
  Expense.create({
    owner: userId,
    date: (new Date(2008, 8, 8)).getTime(),
    description: 'OOOOoooooo',
    amount: 80
  })
  Expense.create({
    owner: userId,
    date: (new Date(2010, 10, 10)).getTime(),
    description: 'ZZZZzzzzz',
    amount: 100
  })
}

describe('REST filter expense service', () => {
  before((done) => {
    // start the server
    this.server = app.listen(3030)
    // once listening do the following
    this.server.once('listening', () => {
      // create mock user
      User.create({
        'email': 'resposadmin',
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
            'email': 'resposadmin',
            'password': 'igzSwi7*Creif4V$'
          })
        // when finished
          .end((err, res) => {
            // set token for auth in other requests
            token = res.body.token
            userId = res.body.data._id
            createSampleData()
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
        res.body.total.should.equal(5)

        res.body.should.have.property('limit')
        res.body.limit.should.equal(200)

        res.body.should.have.property('skip')
        res.body.skip.should.equal(0)

        res.body.should.have.property('data')
        res.body.data.should.have.lengthOf(5)
        done()
      })
  })

  it('should limit expense number', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses?$limit=2&$skip=2')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.body.should.have.property('total')
        res.body.total.should.equal(5)

        res.body.should.have.property('limit')
        res.body.limit.should.equal(2)

        res.body.should.have.property('skip')
        res.body.skip.should.equal(2)

        res.body.should.have.property('data')
        res.body.data.should.have.lengthOf(2)
        done()
      })
  })

  it('should filter by expense description', (done) => {
    // setup a request
    chai.request(app)
    // request to /store
      .get('/expenses?description[$ne]=A')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
    // when finished do the following
      .end((err, res) => {
        res.body.should.have.property('total')
        res.body.total.should.equal(4)

        res.body.should.have.property('limit')
        res.body.limit.should.equal(200)

        res.body.should.have.property('data')
        res.body.data.should.have.lengthOf(4)
        done()
      })
  })

  /* it('should filter by expense amount', (done) => {
   *   // setup a request
   *   chai.request(app)
   *   // request to /store
   *     .get('/expenses?amount[$lte]=21')
   *     .set('Accept', 'application/json')
   *     .set('Authorization', 'Bearer '.concat(token))
   *   // when finished do the following
   *     .end((err, res) => {
   *       console.log(res.body)
   *       res.body.should.have.property('total')
   *       res.body.total.should.equal(2)

   *       res.body.should.have.property('limit')
   *       res.body.limit.should.equal(200)

   *       res.body.should.have.property('data')
   *       res.body.data.should.have.lengthOf(2)
   *       done()
   *     })
   * })

   * it('should filter by expense date', (done) => {
   *   // setup a request
   *   let date = (new Date(2000, 2, 1)).getTime()
   *   chai.request(app)
   *   // request to /store
   *     .get('/expenses?date[$lte]=' + date)
   *     .set('Accept', 'application/json')
   *     .set('Authorization', 'Bearer '.concat(token))
   *   // when finished do the following
   *     .end((err, res) => {
   *       res.body.should.have.property('total')
   *       res.body.total.should.equal(2)

   *       res.body.should.have.property('limit')
   *       res.body.limit.should.equal(200)

   *       res.body.should.have.property('data')
   *       res.body.data.should.have.lengthOf(2)
   *       done()
   *     })
   * })

   * it('should sort by expense date', (done) => {
   *   // setup a request
   *   chai.request(app)
   *   // request to /store
   *     .get('/expenses?$sort[date]=-1')
   *     .set('Accept', 'application/json')
   *     .set('Authorization', 'Bearer '.concat(token))
   *   // when finished do the following
   *     .end((err, res) => {
   *       res.body.data[0].amount.should.equal(100)
   *       res.body.data[4].amount.should.equal(1)
   *       done()
   *     })
   * }) */
})
