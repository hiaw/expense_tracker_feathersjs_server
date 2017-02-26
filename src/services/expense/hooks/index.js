'use strict'

const globalHooks = require('../../../hooks')
const hooks = require('feathers-hooks')
const commonHooks = require('feathers-hooks-common')
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
  create: [
    commonHooks.setCreatedAt('createdAt'),
    commonHooks.setUpdatedAt('updatedAt')
    /* hook.data.createdAt = new Date(); */
    /* auth.restrictToOwner({ idField: 'id', ownerField: 'owner' }) */
  ],
  update: [
    commonHooks.setUpdatedAt('updatedAt'),
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: 'owner',
      owner: true
    })
  ],
  patch: [
    commonHooks.setUpdatedAt('updatedAt'),
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
