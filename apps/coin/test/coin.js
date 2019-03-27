const Coin = artifacts.require("Coin.sol");

const getContract = name => artifacts.require(name)
const { assertRevert } = require('@aragon/test-helpers/assertThrow');

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

contract('Coin app', (accounts) => {
    let kernelBase, aclBase, daoFactory, dao, acl, coin;
  
    const root = accounts[0];
    const member1 = accounts[1];
  
    before(async() => {
      kernelBase = await getContract('Kernel').new(true) // petrify immediately
      aclBase = await getContract('ACL').new()
      daoFactory = await getContract('DAOFactory').new(kernelBase.address, aclBase.address, ZERO_ADDR);
      r = await daoFactory.newDAO(root)
      dao = getContract('Kernel').at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
      acl = getContract('ACL').at(await dao.acl())
  
      //create dao mamnager permission for coin owner
      await acl.createPermission(
        root,
        dao.address,
        await dao.APP_MANAGER_ROLE(),
        root,
        { from: root }
      );
  
      //get new app instance from DAO
      const receipt = await dao.newAppInstance(
        '0x1234',
        (await Coin.new()).address,
        0x0,
        false,
        { from: root }
      )
      coin = Coin.at(
        receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy
      )
  
      //init coin (app)
      await coin.initialize();
  
      //create coin issuer permission for coin owner
      await acl.createPermission(
        root,
        coin.address,
        await coin.ISSUE_ROLE(),
        root,
        { from: root }
      )
  
      //create coin mint permission for coin owner
      await acl.createPermission(
        root,
        coin.address,
        await coin.MINT_ROLE(),
        root,
        { from: root }
      )
    
    });

    describe("Owner default space permissions", async() => {
      it('check owner is token issuer', async() => {
        let tokenIssuerPermission = await acl.hasPermission(root, coin.address, await coin.ISSUE_ROLE());
        assert.equal(tokenIssuerPermission, true);
      });  
    });

    describe("Coin issuing", async () => {
      let name = "coinsence";
      let symbol = "cc";
      let decimals = 18;

      it("should revert when issuing a coin from an address that does not have issuing permission", async() => {
        return assertRevert(async () => {
          await coin.issueCoin(name, symbol, decimals, { from: member1 })
          'address does not have permission to issue token'
        })
      });

      it("issue token", async() => {
        await coin.issueCoin(name, symbol, decimals, { from: root });
        assert.equal(await coin.name(), name);
        assert.equal(await coin.symbol(), symbol);
        assert.equal(await coin.decimal(), decimals);
      });

      it("should revert when issuing an already issued coin", async() => {
        return assertRevert(async () => {
          await coin.issueCoin(name, symbol, decimals, { from: root })
          'address does not have permission to issue token'
        })
      });
    });

    describe("Coin minting", async() => {
      let tokenToMint = 1000;

      it("should revert when mint coin from an address that does not have minting permission", async() => {
        return assertRevert(async() => {
          await coin.mintCoin(tokenToMint, { from: member1})
          'address does not have permission to mint token'
        });
      });

      it("mint coin", async() => {
        await coin.mintCoin(tokenToMint, { from: root });
        let ownerBalance = await coin.balanceOf(root);
        let totalSupply = await coin.totalSupply();
        assert.equal(ownerBalance.toNumber(), tokenToMint);
        assert.equal(totalSupply.toNumber(), tokenToMint);
      });
    });

    describe("Coin management", async() => {
      let tokenToTransfer = 500;

      it("should revert when transfer token to address(0)", async() => {
        return assertRevert(async() => {
          await coin.transfer(ZERO_ADDR, tokenToTransfer)
          'invalid address'
        });
      });

      it("transfer token to member1", async() => {
        let ownerBalanceBeforeTransfer = await coin.balanceOf(root);
        await coin.transfer(member1, tokenToTransfer, { from: root });
        let ownerBalanceAfterTransfer = await coin.balanceOf(root);
        let member1Balance = await coin.balanceOf(member1);
        assert.equal(member1Balance.toNumber(), tokenToTransfer);
        assert.equal(ownerBalanceAfterTransfer.toNumber(), ownerBalanceBeforeTransfer.toNumber()-tokenToTransfer)
      });

    });

});  