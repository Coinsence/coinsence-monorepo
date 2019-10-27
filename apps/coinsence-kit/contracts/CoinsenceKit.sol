pragma solidity ^0.4.24;


import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "./misc/APMNamehashOpen.sol";
import "@coinsence/apps-space/contracts/Space.sol";
import "@coinsence/apps-coin/contracts/Coin.sol";


contract KitBase is APMNamehashOpen {
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

    function handleCleanupPermissions(Kernel dao, ACL acl, address root) internal {
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

    function newInstance(string spaceName, bytes32 descHash, string coinName, string coinSymbol, uint8 coinDecimals, address root) public {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());

        bytes32 appManagerRole = dao.APP_MANAGER_ROLE();
        acl.createPermission(this, dao, appManagerRole, this);

        createCSApps(root, dao, spaceName, descHash, coinName, coinSymbol, coinDecimals);

        handleCleanupPermissions(dao, acl, root);

        emit DeployInstance(dao);
    }

    function createCSApps (
        address root,
        Kernel dao,
        string spaceName,
        bytes32 descHash,
        string coinName,
        string coinSymbol,
        uint8 coinDecimals
    ) internal
    {
        Space space;
        Coin coin;

        bytes32[2] memory appIds = [
            apmNamehashOpen("coinsence-space"),     // 0
            apmNamehashOpen("coinsence-coin")       // 1
        ];

        space = Space(
            dao.newAppInstance(
                appIds[0],
                latestVersionAppBase(appIds[0]),
                new bytes(0),
                true
            )
        );
        emit InstalledApp(space, appIds[0]);

        coin = Coin(
            dao.newAppInstance(
                appIds[1],
                latestVersionAppBase(appIds[1]),
                new bytes(0),
                true
            )
        );
        emit InstalledApp(coin, appIds[1]);

        initializeCSApps(space, coin, spaceName, descHash, coinName, coinSymbol, coinDecimals);

        handleCSPermissions(dao, space, coin, root);
    }

    function initializeCSApps(
        Space space,
        Coin coin,
        string spaceName,
        bytes32 descHash,
        string coinName,
        string coinSymbol,
        uint8 coinDecimals
    ) internal
    {
        space.initialize(spaceName, descHash);
        coin.initialize(coinName, coinSymbol, coinDecimals);
    }

    function handleCSPermissions(
        Kernel dao,
        Space space,
        Coin coin,
        address root
    ) internal
    {
        ACL acl = ACL(dao.acl());

        //Space roles
        acl.createPermission(root, space, space.SPACE_MANAGER_ROLE(), root);
        acl.createPermission(root, space, space.ADD_MEMBER_ROLE(), root);
        acl.createPermission(root, space, space.REMOVE_MEMBER_ROLE(), root);

        //Coin roles
        acl.createPermission(root, coin, coin.ISSUE_ROLE(), root);
        acl.createPermission(root, coin, coin.MINT_ROLE(), root);
    }

}
