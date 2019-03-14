const Space = artifacts.require("Space.sol");

const {
  ACL,
  DAOFactory,
  Kernel
} = require('@coinsence/test-helpers/artifacts')

const { assertRevert } = require('@coinsence/test-helpers/assertThrow');

const getContract = name => artifacts.require(name)

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

contract('Space app', (accounts) => {
    let kernelBase, aclBase, daoFactory, dao, acl, space;
  
    const root = accounts[0];
    const member1 = accounts[1];
  
    before(async() => {
      //init kernel base
      const kernelBase = await getContract('Kernel').new(true) // immediately petrify
      //init acl base
      const aclBase = await getContract('ACL').new()
      //init new dao factory
      daoFactory = await DAOFactory.new(
        kernelBase.address,
        aclBase.address,
        ZERO_ADDR
      );
  
      //init new dao from dao factory
      const r = await daoFactory.newDAO(root)
      dao = Kernel.at(
        r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao
      );
      //get DAO acl
      acl = ACL.at(await dao.acl());
  
      //create dao mamnager permission for space owner
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
        (await Space.new()).address,
        0x0,
        false,
        { from: root }
      )
      space = Space.at(
        receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy
      )
  
      //init space (app)
      await space.initialize("coinsence", '0x0', []);
  
      //create space manager permission for space owner
      await acl.createPermission(
        root,
        space.address,
        await space.SPACE_MANAGER_ROLE(),
        root,
        { from: root }
      )
    
    });

    describe("DAO", async() => {

        it('check initialized DAO', async() => {
          assert.notEqual(dao, undefined);
          console.log(dao.address);
        });
    
        it('check owner is app manager', async() => {
          let daoManagerPermission = await acl.hasPermission(root, dao.address, await dao.APP_MANAGER_ROLE());
          assert.equal(daoManagerPermission, true);
        });
    
    });

});  