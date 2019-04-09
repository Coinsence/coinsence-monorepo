var Member = artifacts.require('./Member.sol')

module.exports = function (deployer) {
  deployer.deploy(Member)
}
