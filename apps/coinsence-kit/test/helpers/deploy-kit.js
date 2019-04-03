const deployDAOFactory = require('@aragon/os/scripts/deploy-daofactory.js')
const CoinsenceKit = artifacts.require('CoinsenceKit')

const ensAddr = process.env.ENS

module.exports = async (callback) => {
  if (!ensAddr) {
    callback(new Error("ENS address not found in environment variable ENS"))
  }

  const { daoFactory } = await deployDAOFactory(null, { artifacts, verbose: false })

  const coinsenceKit = await CoinsenceKit.new(ensAddr)
  console.log(coinsenceKit.address)

  coinsenceKit.newInstance("coinsence", web3.fromAscii("0"), []).then((ret) => {
    console.log(ret);
    callback();
  }).catch((e) => {
    console.log(e);
  })

}