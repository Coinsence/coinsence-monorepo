/* eslint-disable no-undef */
const namehash = require('eth-ens-namehash').hash;
const CoinsenceKit = artifacts.require("CoinsenceKit.sol");
const getContract = name => artifacts.require(name)
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
const chai = require('chai')
/* eslint-disable no-unused-vars */
const should = chai.should()
/* eslint-enable no-unused-vars */
const arapp = require('../arapp.json')
const ENS_ADDRESS = arapp.environments.default.registry

contract('DAO bare kit', (accounts) => {
    let coinsenceKit;
    let address;
    let apps;
    let kernel;
    let space;
    let coin;

    before(async () => {
        coinsenceKit = await CoinsenceKit.new(ENS_ADDRESS, { from: accounts[0] });
    })
  
    describe("New DAO instance", () => {
        it("kit should be defined", async() => {
            assert.notEqual(coinsenceKit, undefined);
        });

        it('it should deploy DAO', async () => {
            const receipt = await coinsenceKit.newInstance("coinsence", web3.fromAscii("0"), accounts[0], { from: accounts[0] });

            address = receipt.logs.filter(l => l.event === 'DeployInstance')[0].args.dao
            apps = receipt.logs
                .filter(l => l.event === 'InstalledApp')
                .map(event => {
                    return { id: event.args.appId, proxy: event.args.appProxy }
                })

            address.should.not.equal(ZERO_ADDR);
        });

        it('it should install apps', async () => {
            apps[0].id.should.equal(namehash('coinsence-space.aragonpm.eth'))
            apps[1].id.should.equal(namehash('coinsence-coin.aragonpm.eth'))
        });

        it('it should initialize apps', async () => {
            space = await getContract('Space').at(apps[0].proxy);
            coin = await getContract('Coin').at(apps[1].proxy);
            ;(await Promise.all([
                space.hasInitialized(),
                coin.hasInitialized()
            ])).should.deep.equal([true, true])
        });

        it('it should set permissions', async () => {
            kernel = await getContract('Kernel').at(address);
            ;(await Promise.all([
                kernel.hasPermission(accounts[0], space.address, await space.SPACE_MANAGER_ROLE(), '0x0'),
                kernel.hasPermission(accounts[0], coin.address, await coin.ISSUE_ROLE(), '0x0'),
                kernel.hasPermission(accounts[0], coin.address, await coin.MINT_ROLE(), '0x0'),
            ])).should.deep.equal([true, true, true])
        });

    });
})
