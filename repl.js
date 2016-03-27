// repl for the laserBoat configuration
var repl = require('repl');
var r = repl.start({
  prompt: 'laserBoat > ',
});

// try {
//   process.chdir('/home/pi/laserboat');
//   //console.log('New directory: ' + process.cwd());
// }
// catch (err) {
//   console.log('chdir: ' + err);
// }

r.context.geo = require('./geometry');
r.context.sp  = require('./serialMod');
r.context.sw  = r.context.sp.lsw;
r.context.mck  = r.context.sp.mck;
r.context.mv  = r.context.sp.wr;
r.context.print = function() {
console.log(JSON.stringify(arguments, null, 2));
};

r.context.unload = function(name) {
var path = require.resolve(name);
delete require.cache[path];
};


// The second let's you clear the require cache, so you can change files and re-require on the fly.
// Use:
// var thing = require('thing');
// Change something in thing
// unload('thing');
// var thing = require('thing');
