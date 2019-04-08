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

module.exports = async function(callback) {
  let coinsence;
  try {
    coinsence = await initCoinsence(web3);
  } catch(e) {
    callback(e);
    return;
  }

  console.log(`Defined variables: coinsence, web3`);
  let r = REPL.start();
  r.context.coinsence = coinsence;
  r.context.web3 = web3;
  r.eval = promiseEval(r);

  r.on('exit', () => {
    console.log('Bye');
    callback();
  });
}
