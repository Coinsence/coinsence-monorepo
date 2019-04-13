const REPL = require('repl');
const promptly = require('promptly');

const CoinsenceKit = require('../lib/kit.js');
const Coinsence = require('../lib/coinsence.js');
const initNetwork = require('./helpers/init_network.js');

const defaultDaoAddresses = require('../lib/addresses/dao.json');
const kitAddresses = require('../lib/addresses/CoinsenceKit.json');

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

initNetwork().then(async function(details) {

  const defaultDaoAddress = defaultDaoAddresses[details.networkId];
  let kernelAddress = await promptly.prompt(`DAO address (default: ${defaultDaoAddress}):`, { default: defaultDaoAddress });

  const kitAddress = kitAddresses[details.networkId];

  const kit = new CoinsenceKit(
    details.provider,
    details.signer,
    { networkId: details.networkId, address: kitAddress }
  );

  const coinsence = await new Coinsence(details.provider, details.signer, { addresses: { Kernel: kernelAddress } }).init();

  console.log(`Defined variables: coinsence, kit, ethProvider`);
  let r = REPL.start();
  r.context.coinsence = coinsence;
  r.context.kit = kit;
  r.context.ethProvider = coinsence.provider;
  r.eval = promiseEval(r);

  r.on('exit', () => {
    console.log('Bye');
  });
}).catch(console.log);
