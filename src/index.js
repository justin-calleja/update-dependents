var pkgDependents = require('pkg-dependents');

function updateDependentFactory(pkgName, dependentType, version) {
  return function updateDependent(dependent) {
    dependent.pkgJSON[dependentType][pkgName] = version;
  }
}

/**
 * Updates the version of pkgName in each dependent if it differs from the version of
 * pkgName in its package.json.
 * @param  {string}   pkgName       the pkgName whose version will be updated in the dependents
 * @param  {[Object]} opts          can pass in opts.versionPrefix:string (default '~') and paths
 * @param  {Function} cb            on done callback (err, result)
 * @return {Object.<IndexInfo>}
 */
function updateDependents(pkgName, opts, cb) {
  var paths = opts.paths || [];
  var versionPrefix = opts.versionPrefix || '~';

  pkgDependents(pkgName, { paths: paths }, (err, result) => {
    if (err) cb(err, result);

    var copy = JSON.parse(JSON.stringify(result));

    var pkgAndDependents = copy[pkgName];
    if (pkgAndDependents === undefined) {
      cb(new Error(`no result found for ${pkgName}`), null);
    }
    var dependents = pkgAndDependents.dependents;
    if (dependents === undefined) {
      cb(new Error(`no dependents found for ${pkgName}`), null);
    }
    var version = versionPrefix + pkgAndDependents.pkgJSON.version;
    dependents.dependencyDependents.forEach(updateDependentFactory(pkgName, 'dependencies', version));
    dependents.peerDependencyDependents.forEach(updateDependentFactory(pkgName, 'peerDependencies', version));
    dependents.devDependencyDependents.forEach(updateDependentFactory(pkgName, 'devDependencies', version));

    cb(null, {
      original: result,
      updated: copy
    });
  });
}

module.exports = updateDependents;
