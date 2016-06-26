import { Dependents } from 'pkg-dependents/lib';
import { PkgJSONInfo } from 'pkg-json-info-dict/lib';

export const NO_VERSION = 'N/A';

export interface UpdateReportRow {
  package: string;
  dependent: string;
  depVersionRange: string;
  peerDepVersionRange: string;
  devDepVersionRange: string;
}

export function createUpdateReportRows(pkg: PkgJSONInfo, dependents: Dependents): UpdateReportRow[] {
  var depRows: UpdateReportRow[] = Object.keys(dependents.dependencyDependents).map(key => {
    var dependent = dependents.dependencyDependents[key];
    var pkgVersion = dependent.pkgJSON.dependencies[pkg.pkgJSON.name];
    return {
      package: `${pkg.pkgJSON.name}@${pkg.pkgJSON.version}`,
      dependent: `${dependent.pkgJSON.name}@${dependent.pkgJSON.version}`,
      depVersionRange: dependent.pkgJSON.dependencies[pkg.pkgJSON.name],
      peerDepVersionRange: NO_VERSION,
      devDepVersionRange: NO_VERSION
    };
  });
  var peerDepRows: UpdateReportRow[] = Object.keys(dependents.peerDependencyDependents).map(key => {
    var dependent = dependents.peerDependencyDependents[key];
    var pkgVersion = dependent.pkgJSON.peerDependencies[pkg.pkgJSON.name];
    return {
      package: `${pkg.pkgJSON.name}@${pkg.pkgJSON.version}`,
      dependent: `${dependent.pkgJSON.name}@${dependent.pkgJSON.version}`,
      depVersionRange: NO_VERSION,
      peerDepVersionRange: dependent.pkgJSON.peerDependencies[pkg.pkgJSON.name],
      devDepVersionRange: NO_VERSION
    };
  });
  var devDepRows: UpdateReportRow[] = Object.keys(dependents.devDependencyDependents).map(key => {
    var dependent = dependents.devDependencyDependents[key];
    var pkgVersion = dependent.pkgJSON.devDependencies[pkg.pkgJSON.name];
    return {
      package: `${pkg.pkgJSON.name}@${pkg.pkgJSON.version}`,
      dependent: `${dependent.pkgJSON.name}@${dependent.pkgJSON.version}`,
      depVersionRange: NO_VERSION,
      peerDepVersionRange: NO_VERSION,
      devDepVersionRange: dependent.pkgJSON.devDependencies[pkg.pkgJSON.name]
    };
  });

  return depRows.concat(peerDepRows).concat(devDepRows);
}
