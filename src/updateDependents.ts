import { Dependents } from 'pkg-dependents/lib';
import { PkgJSONInfoDict } from 'pkg-json-info-dict/lib';
import { merge } from 'lodash';

export interface Opts {
  versionPrefix?: string;
}

 /**
  * Updates the version of pkgName in each dependent's use of pkgName in its package.json.
  *
  * @param  {string}     pkgName         the name of the package whose version will be updated in the dependents
  * @param  {string}     newVersion      the new version to update to
  * @param  {Dependents} dependents      the dependents of package with name pkgName
  * @param  {Opts}       opts            options (see Opts type)
  * @return {Dependents}                 an updated copy of the dependents
  */
export default function updateDependents(pkgName: string, newVersion: string, dependents: Dependents, opts: Opts = {}): Dependents {
  if (!pkgName) throw new Error('Missing package name');
  if (!dependents) throw new Error('Missing dependents');
  if (!newVersion) throw new Error('Missing version to update to');

  var versionPrefix = opts.versionPrefix || '~';
  var version = versionPrefix + newVersion;
  var updatedDependents = <Dependents> merge({}, dependents);

  Object.keys(updatedDependents.dependencyDependents).forEach(
    updateDependentFactory(pkgName, version, 'dependencies', updatedDependents.dependencyDependents)
  );
  Object.keys(updatedDependents.peerDependencyDependents).forEach(
    updateDependentFactory(pkgName, version, 'peerDependencies', updatedDependents.peerDependencyDependents)
  );
  Object.keys(updatedDependents.devDependencyDependents).forEach(
    updateDependentFactory(pkgName, version, 'devDependencies', updatedDependents.devDependencyDependents)
  );

  return updatedDependents;
}

function updateDependentFactory(pkgName: string, version: string, dependentType: string, pkgJSONInfoDict: PkgJSONInfoDict) {
  return function updateDependent(dependentName: string) {
    var dependentPkgJSONInfo = pkgJSONInfoDict[dependentName];
    if (!dependentPkgJSONInfo) throw new Error(`No package with the name ${dependentName} in ${pkgJSONInfoDict}`);
    var dependencies = dependentPkgJSONInfo.pkgJSON[dependentType];
    if (!dependencies) throw new Error(`package.json of ${dependentName} does not have a key ${dependentType}`);
    var entryToUpdate = dependencies[pkgName];
    if (!entryToUpdate) throw new Error(`${pkgName} is not any type of dependency of ${dependentName}`);

    // do full access:
    dependentPkgJSONInfo.pkgJSON[dependentType][pkgName] = version;
  }
}
