const Member = artifacts.require("Member.sol");

const getContract = name => artifacts.require(name)
const { assertRevert } = require('@aragon/test-helpers/assertThrow');

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

contract('Member app', (accounts) => {
    let kernelBase, aclBase, daoFactory, dao, acl, memberApp;
  
    const root = accounts[0];
    const member1 = accounts[1];

    before(async() => {
        kernelBase = await getContract('Kernel').new(true) // petrify immediately
        aclBase = await getContract('ACL').new()
        daoFactory = await getContract('DAOFactory').new(kernelBase.address, aclBase.address, ZERO_ADDR);
        r = await daoFactory.newDAO(root)
        dao = getContract('Kernel').at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
        acl = getContract('ACL').at(await dao.acl())
    
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
          (await Member.new()).address,
          0x0,
          false,
          { from: root }
        )
        memberApp = Member.at(
          receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy
        )
    
        //init member (app)
        await memberApp.initialize();
    });

    describe("Add member", async() => {
        it("should revert to add member with address(0)", async() => {
            return assertRevert(async () => {
              await memberApp.addMember(ZERO_ADDR, web3.fromAscii("0"), { from: member1 })
              'invalid address'
            })
        });

        it("add member", async() => {
            let membersCountBefore = await memberApp.membersCount();
            await memberApp.addMember(member1, web3.fromAscii("0"), { from: member1 });
            let membersCountAfter = await memberApp.membersCount();
            assert.equal(membersCountAfter.toNumber()-membersCountBefore.toNumber(), 1);
            assert.equal((await memberApp.membersIds(member1)).toNumber(), membersCountAfter.toNumber());
            assert.equal(await memberApp.exists(membersCountAfter), true);
            assert.equal(await memberApp.addressExists(member1), true);
            assert.equal((await memberApp.getMemberIdByAddress(member1)).toNumber(), membersCountAfter.toNumber());
        });

        it("should revert to add an existant member", async() => {
            return assertRevert(async () => {
              await memberApp.addMember(member1, web3.fromAscii("0"), { from: member1 })
              'member already exists'
            })
        });
    });

    describe("Update member IPFS", async() => {
        it("should revert to update account not related to a member", async() => {
            return assertRevert(async () => {
              await memberApp.updateMemberIpfsHash(1, web3.fromAscii("1"), { from: accounts[2] })
              'account does not belong to sender of the tx'
            })
        });

        it("update account IPFS", async() => {
            await memberApp.updateMemberIpfsHash(1, web3.fromAscii("1"), { from: member1 });
        });
    });

    describe("Update member account", async() => {
        it("should revert to update account not related to a member", async() => {
            return assertRevert(async () => {
              await memberApp.updateMemberAccount(1, accounts[2], accounts[3], { from: member1 })
              'account does not belong to sender of the tx'
            })
        });

        it("update account", async() => {
            await memberApp.updateMemberAccount(1, member1, accounts[2], { from: member1 });
            let memberAddress = await memberApp.getMemberAddressById(1);
            assert.equal(memberAddress, accounts[2]);
        });
    });

})
