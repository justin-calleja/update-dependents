var assert = require('chai').assert;
var updateDependents = require('../lib').default;

var dDependents = require('./fixtures/dDependents');

describe('update-dependents', function() {
  it('check original dependents remain unchanged and updated dependents have the update', function () {
    var updatedDependents = updateDependents('d', '2.0.0', dDependents);
    assert.equal(dDependents.peerDependencyDependents.a.pkgJSON.peerDependencies.d, '^0.0.1', 'original dependents should be untouched');
    assert.equal(dDependents.devDependencyDependents.b.pkgJSON.devDependencies.d, '^0.0.1', 'original dependents should be untouched');

    assert.equal(updatedDependents.peerDependencyDependents.a.pkgJSON.peerDependencies.d, '~2.0.0', 'updatedDependents should have the update');
    assert.equal(updatedDependents.devDependencyDependents.b.pkgJSON.devDependencies.d, '~2.0.0', 'updatedDependents should have the update');
  });
});
