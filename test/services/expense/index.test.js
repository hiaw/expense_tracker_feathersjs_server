'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('expense service', function() {
  it('registered the expenses service', () => {
    assert.ok(app.service('expenses'));
  });
});
