var assert = require('chai').assert;
var updateDependents = require('../src');
var path = require('path');

var fixturesPath = path.join(__dirname, 'fixtures');
var dirsInFixtures = [path.join(fixturesPath, 'dir1'), path.join(fixturesPath, 'dir2')];

suite('update-dependents interface', function() {
  test("d's dependents are a and b. Expect d's reference in a and b to be version ~1.0.0", function (cb) {
    updateDependents('d', {
      paths: dirsInFixtures
    }, (err, result) => {
      assert.equal(result.d.dependents.peerDependencyDependents[0].pkgJSON.name, 'a', 'expecting pkg a to be a peerDependencyDependent of pkg d');
      assert.equal(result.d.dependents.devDependencyDependents[0].pkgJSON.name, 'b', 'expecting pkg b to be a devDependencyDependent of pkg d');

      assert.equal(result.d.dependents.peerDependencyDependents[0].pkgJSON.peerDependencies.d, '~1.0.0', 'expecting the reference to d to be for version ~1.0.0');
      assert.equal(result.d.dependents.devDependencyDependents[0].pkgJSON.devDependencies.d, '~1.0.0', 'expecting the reference to d to be for version ~1.0.0');
      cb();
    });
  });
});
