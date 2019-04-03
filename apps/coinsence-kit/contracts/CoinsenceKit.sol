pragma solidity ^0.4.24;


import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";
import "@coinsence/apps-space/contracts/Space.sol";
import "@coinsence/apps-coin/contracts/Coin.sol";


contract KitBase is APMNamehash {
    ENS public ens;
    DAOFactory public fac;

    event DeployInstance(address dao);
    event InstalledApp(address appProxy, bytes32 appId);

    constructor (ENS _ens) public {
        ens = _ens;

        bytes32 bareKit = apmNamehash("bare-kit");
        fac = KitBase(latestVersionAppBase(bareKit)).fac();
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId)).addr(appId));
        (,base,) = repo.getLatest();

        return base;
    }

    function cleanupDAOPermissions(Kernel dao, ACL acl, address root) internal {
        // Kernel permission clean up
        cleanupPermission(acl, root, dao, dao.APP_MANAGER_ROLE());

        // ACL permission clean up
        cleanupPermission(acl, root, acl, acl.CREATE_PERMISSIONS_ROLE());
    }

    function cleanupPermission(ACL acl, address root, address app, bytes32 permission) internal {
        acl.grantPermission(root, app, permission);
        acl.revokePermission(this, app, permission);
        acl.setPermissionManager(root, app, permission);
    }
}


contract CoinsenceKit is KitBase {

    constructor(ENS _ens)
    // solium-disable-next-line no-empty-blocks 
    KitBase(_ens) public {
    }

    function newInstance(string name, bytes32 descHash, address[] members) public {
        bytes32[2] memory appIds = [
            apmNamehash("coinsence-space"),     // 0
            apmNamehash("coinsence-coin")       // 1
        ];

        address root = msg.sender;
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());

        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

        // Apps
        Space space = Space(
            dao.newAppInstance(
                appIds[0],
                latestVersionAppBase(appIds[0])
            )
        );
        emit InstalledApp(space, appIds[0]);

        Coin coin = Coin(
            dao.newAppInstance(
                appIds[1],
                latestVersionAppBase(appIds[1])
            )
        );
        emit InstalledApp(coin, appIds[1]);

        space.initialize(name, descHash, members);
        coin.initialize();

        //Space roles
        acl.createPermission(root, space, space.SPACE_MANAGER_ROLE(), root);
        //Coin roles
        acl.createPermission(root, coin, coin.ISSUE_ROLE(), root);
        acl.createPermission(root, coin, coin.MINT_ROLE(), root);

        cleanupDAOPermissions(dao, acl, root);

        emit DeployInstance(dao);
    }

}
