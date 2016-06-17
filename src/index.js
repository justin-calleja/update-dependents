var pkgDependents = require('pkg-dependents');

function updateDependentFactory(pkgName, dependentType, version) {
  return function updateDependent(dependent) {
    dependent.pkgJSON[dependentType][pkgName] = version;
  }
}

/**
 * Updates the version of pkgName in each dependent if it differs from the version of
 * pkgName in its package.json.
 * @param  {[type]}   pkgName     the pkgName whose version will be updated in the dependents
 * @param  {[type]}   opts        can pass in opts.versionPrefix:string (default '~')
 * @param  {Function} cb          on done callback (err, result)
 * @return {Object.<IndexInfo>}           [description]
 */
function updateDependents(pkgName, opts, cb) {
  var paths = opts.paths || [];
  var versionPrefix = opts.versionPrefix || '~';

  pkgDependents(pkgName, { paths: paths }, (err, result) => {
    if (err) cb(err, result);

    var pkgAndDependents = result[pkgName];
    var dependents = pkgAndDependents.dependents;
    var version = versionPrefix + pkgAndDependents.pkgJSON.version;
    dependents.dependencyDependents.forEach(updateDependentFactory(pkgName, 'dependencies', version));
    dependents.peerDependencyDependents.forEach(updateDependentFactory(pkgName, 'peerDependencies', version));
    dependents.devDependencyDependents.forEach(updateDependentFactory(pkgName, 'devDependencies', version));

    cb(null, result);
  });
}

module.exports = updateDependents;
