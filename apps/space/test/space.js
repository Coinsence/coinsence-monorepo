const Space = artifacts.require("Space.sol");

const getContract = name => artifacts.require(name)
const { assertRevert } = require('@aragon/test-helpers/assertThrow');

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

contract('Space app', (accounts) => {
    let kernelBase, aclBase, daoFactory, dao, acl, space;
    let countMembers = 0;
  
    const root = accounts[0];
    const member1 = accounts[1];
    const member2 = accounts[2];
    const member3 = accounts[3];
  
    before(async() => {
      kernelBase = await getContract('Kernel').new(true) // petrify immediately
      aclBase = await getContract('ACL').new()
      daoFactory = await getContract('DAOFactory').new(kernelBase.address, aclBase.address, ZERO_ADDR);
      r = await daoFactory.newDAO(root)
      dao = getContract('Kernel').at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
      acl = getContract('ACL').at(await dao.acl())

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
      await space.initialize("coinsence", '0x0');

      //increment space members number
      countMembers++;
  
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
        });
    
        it('check owner is app manager', async() => {
          let daoManagerPermission = await acl.hasPermission(root, dao.address, await dao.APP_MANAGER_ROLE());
          assert.equal(daoManagerPermission, true);
        });
    });

    describe("Owner default space permissions", async() => {
      it('check owner is space manager', async() => {
        let spaceManagerPermission = await acl.hasPermission(root, space.address, await space.SPACE_MANAGER_ROLE());
        assert.equal(spaceManagerPermission, true);
      });  
    });

    describe("Space management", async () => {
      it("should revert when adding a member from an address that does not have manager permission", async() => {
        return assertRevert(async () => {
          await space.addMembers([accounts[2]], { from: member1 })
          'address does not have permission to add member'
        })
      });
  
      it("should revert when adding a member address same as `msg.sender`", async() => {
        return assertRevert(async () => {
          await space.addMembers([root], { from: root })
          'member address should be different from msg.sender'
        })
      });
  
      it("should revert when adding a member with address(0)", async() => {
        return assertRevert(async () => {
          await space.addMembers([ZERO_ADDR], { from: root })
          'member address should be different from msg.sender'
        })
      });
  
      it("add new member", async() => {
        await space.addMembers([member1, member2], { from: root });
        assert.equal(await space.isMember(member1), true);
        assert.equal(await space.isMember(member2), true);
        //increment space members number by 2
        countMembers = countMembers+2;
        //let countMembers = await space.getMembersCount();
        assert.equal((await space.getMembersCount()).toNumber(), countMembers);
      });
    });

    describe("Leave space", async () => {
      it("should revert when not a member address request to leave space", async() => {
        return assertRevert(async () => {
          await space.leaveSpace({ from: member3 })
          'address is not space member to leave it'
        })
      });

      it("leave space", async() => {
        assert.equal(await space.isMember(member1), true);
        await space.leaveSpace({ from: member1 });
        assert.equal(await space.isMember(member1), false);
        ///the below code will function if we change the leave space function to decrease
        ///members array by 1 (currently it only remove that address from the array without modifying length)
        //decrement space members number by 1
        //countMembers--;
        //assert.equal((await space.getMembersCount()).toNumber(), countMembers);
      });
    });

});  