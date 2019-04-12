const REPL = require('repl');

const initCoinsence = require('./helpers/init_coinsence.js');

function promiseEval (repl) {
  const currentEval = repl.eval;
  return function (cmd, context, filename, callback) {
    currentEval(cmd, context, filename, (err, result) => {
      if (result && typeof result.then === 'function') {
        console.log('...waiting for promise to resolve');
        return result
          .then(response => callback(null, response))
          .catch(err => callback(err, null));
      }
      return callback(err, result);
    })
  }
}

initCoinsence().then(coinsence => {
  console.log(`Defined variables: coinsence, ethProvider`);
  let r = REPL.start();
  r.context.coinsence = coinsence;
  r.context.ethProvider = coinsence.provider;
  r.eval = promiseEval(r);

  r.on('exit', () => {
    console.log('Bye');
  });
}).catch(console.log);
