module.exports = function(web3) {
  return new Promise((resolve, reject) => {
    let func;
    if (web3.version.getNetwork) {
      func = web3.version.getNetwork;
    } else {
      func = web3.eth.net.getId;
    }
    func((err, network) => {
      if (err) {
        reject(err);
      } else {
        resolve(network);
      }
    })
  })
}
