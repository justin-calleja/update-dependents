var repl = require('repl');
var updateDependents = require('../lib').default;

var replServer = repl.start({
  prompt: '> '
});

replServer.context.updateDependents = updateDependents;
replServer.context.dDependents = require('./fixtures/dDependents');
replServer.context.dDependentsUpdated = updateDependents('d', '2.0.0', replServer.context.dDependents);

replServer.context.print = (str) => console.log(JSON.stringify(str, null, 2));
