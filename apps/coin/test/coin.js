const Coin = artifacts.require("Coin.sol");

const getContract = name => artifacts.require(name)
const { assertRevert } = require('@aragon/test-helpers/assertThrow');

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

contract('Coin app', (accounts) => {
    let kernelBase, aclBase, daoFactory, dao, acl, coin;
    let coinName, coinSymbol, coinDecimals;
  
    const root = accounts[0];
    const member1 = accounts[1];
  
    before(async() => {
      coinName = "Coinsence Coin";
      coinSymbol = "CC";
      coinDecimals = 18;

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
      await coin.initialize(coinName, coinSymbol, coinDecimals);
  
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
      it("Check coin parameters", async() => {
        assert.equal(await coin.name(), coinName);
        assert.equal(await coin.symbol(), coinSymbol);
        assert.equal(await coin.decimal(), coinDecimals);
      });
    });

    describe("Coin minting", async() => {
      let tokenToMint = 1000;

      it("should revert when mint coins from an address that does not have minting permission", async() => {
        return assertRevert(async() => {
          await coin.mintCoin(root, tokenToMint, { from: member1})
          'address does not have permission to mint token'
        });
      });

      it("should revert when mint coins to address(0)", async() => {
        return assertRevert(async() => {
          await coin.mintCoin(ZERO_ADDR, tokenToMint, { from: root})
          'address does not have permission to mint token'
        });
      });

      it("should revert when mint amount of coins equal to 0", async() => {
        return assertRevert(async() => {
          await coin.mintCoin(root, 0, { from: root})
          'address does not have permission to mint token'
        });
      });

      it("mint coin", async() => {
        await coin.mintCoin(root, tokenToMint, { from: root });
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