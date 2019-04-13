const Base = require('./base');

class Kit extends Base {

  newInstance(args, options = {}) {
    let { name, descHash } = args;

    return this.functions.newInstance(name, descHash, options)
      .then(transaction => {
        return transaction.wait().then(result => {
          const txHash = result.transactionHash;
          const deployEvent = result.events.find(l => l.event === 'DeployInstance');
          if (!deployEvent) { throw new Error('No DeployInstance event found') }

          return Promise.resolve({ txHash: txHash, daoAddress: deployEvent.args.dao });
        })
      });
  }
}

module.exports = Kit;
