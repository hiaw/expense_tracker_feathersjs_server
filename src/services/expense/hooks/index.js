'use strict'

const globalHooks = require('../../../hooks')
const hooks = require('feathers-hooks')
const auth = require('feathers-authentication').hooks

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [
    auth.queryWithCurrentUser({ idField: '_id', as: 'owner' })
  ],
  get: [
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: 'owner',
      owner: true
    })
  ],
  create: [],
  update: [
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: 'owner',
      owner: true
    })
  ],
  patch: [
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: 'owner',
      owner: true
    })
  ],
  remove: [
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: 'owner',
      owner: true
    })
  ]
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
