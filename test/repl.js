var repl = require('repl');
var updateDependents = require('../src');
var path = require('path');

var replServer = repl.start({
  prompt: '> '
});

replServer.context.updateDependents = updateDependents;

var fixturesPath = replServer.context.fixturesPath = path.join(__dirname, 'fixtures');
var dirsInFixtures = [path.join(fixturesPath, 'dir1'), path.join(fixturesPath, 'dir2')];

updateDependents('d', { paths: dirsInFixtures }, (err, res) => {
  replServer.context.res = res;
});
