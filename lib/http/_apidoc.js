// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine PostWalletSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} address Address of the wallet.
 * @apiSuccess (201) {String} mnemonic Mnemonic of the wallet.
 */

/**
 * @apiDefine GetWalletSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} address Address of the wallet.
 * @apiSuccess (201) {String} privateKey Wallet private key.
 * @apiSuccess (201) {String} balanceWei Address balance in Wei unit.
 * @apiSuccess (201) {String} balanceEther Address balance in Ether.
 * @apiSuccess (201) {String} balanceHex Address balance in Hexadecimal.
 * @apiSuccess (201) {String} transactionCount Number of transaction from that address.
 */

/**
 * @apiDefine PostDaoSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) Created
 */

/**
 * @apiDefine GetDaoSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} txHash Transaction hash.
 * @apiSuccess (201) {String} txHash Transaction hash.
 * @apiSuccess (201) {String} daoAddress DAO address.
 * @apiSuccess (201) {String[]} Apps instances.
 */


/**
 * @apiDefine PostCoinMintSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} txHash Transaction hash.
 */

/**
 * @apiDefine PostCoinTransferSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {Object} transaction Transaction.
 */

/**
 * @apiDefine GetCoinBalanceSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} balance in Hex.
 * @apiSuccess (201) {String} balance in Wei.
 */

/**
 * @apiDefine GetCoinTotalsupplySuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} supply in Hex.
 * @apiSuccess (201) {String} supply in Wei.
 */

/**
 * @apiDefine GetSpaceSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String[]} Addresses ACL and Coin app addresses.
 */

/**
 * @apiDefine GetSpaceMembersCountSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {Number} Space members count.
 */

/**
 * @apiDefine GetSpaceOwnerSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} Space owner address.
 */

/**
 * @apiDefine PostSpaceMembersSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} txHash Transaction hash.
 */

/**
 * @apiDefine PostSpaceLeaveSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} txHash Transaction hash.
 */

/**
 * @apiDefine PostSetTransferEventListenerSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) Created
 */

/**
 * @apiDefine PostSpaceRemoveMemberSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) {String} txHash Transaction hash.
 */

 /**
 * @apiDefine PostWalletRefundSuccess
 * @apiVersion 1.0.0
 *
 * @apiSuccess (201) Created
 */



// ------------------------------------------------------------------------------------------
// Current Errors.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine MissingAccountIdError
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} accountId Accounts unique ID.
 * 
 * @apiError (400) MissingAccountId User account ID is missing.
 *
 * @apiErrorExample  Bad Request response:
 *     HTTP 400 Bad Request
 *     {
 *       "error": "accountId is missing"
 *     }
 */

/**
 * @apiDefine MissingAccountsIdsError
 * @apiVersion 1.0.0
 *
 * @apiParam {String[]} accountsIds Accounts unique ID.
 * 
 * @apiError (400) MissingAccountsIds Users accounts IDs is missing.
 *
 * @apiErrorExample  Bad Request response:
 *     HTTP 400 Bad Request
 *     {
 *       "error": "accountsIds is missing"
 *     }
 */


/**
 * @apiDefine ExistantWalletError
 * @apiVersion 1.0.0
 *
 * @apiError (409) ExistantWallet User account already have a wallet.
 *
 * @apiErrorExample  Conflict response:
 *     HTTP 409 Conflict
 *     {
 *       "error": "account already has a wallet"
 *     }
 */

/**
 * @apiDefine LoadWalletError
 * @apiVersion 1.0.0
 *
 * @apiError (404) NotFound could not load user wallet.
 *
 * @apiErrorExample  Not Found response:
 *     HTTP 404 Not Found
 *     {
 *       "error": "Could not load wallet"
 *     }
 */

/**
 * @apiDefine MissingDaoError
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} dao Dao address
 *
 * @apiError (400) MissingDaoError dao address is missing.
 *
 * @apiErrorExample  Bad Request response:
 *     HTTP 400 Bad Request
 *     {
 *       "error": "dao is missing"
 *     }
 */

/**
 * @apiDefine LoadDaoError
 * @apiVersion 1.0.0
 *
 * @apiError (404) NotFound could not load dao.
 *
 * @apiErrorExample  Not Found response:
 *     HTTP 404 Not Found
 *     {
 *       "error": "Could not load dao"
 *     }
 */

/**
 * @apiDefine MissingSpaceIdError
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} spaceId Space unique ID.
 * 
 * @apiError (400) MissingSpaceId Space account ID is missing.
 *
 * @apiErrorExample  Bad Request response:
 *     HTTP 400 Bad Request
 *     {
 *       "error": "spaceId is missing"
 *     }
 */


/**
 * @apiDefine InternalServerError
 * @apiVersion 1.0.0
 *
 * @apiError (500) InternalServer The server encountered an unexpected condition that prevented it from fulfilling the request.
 */

/**
 * @apiDefine MissingWalletAddressError
 * @apiVersion 1.0.0
 *
 * @apiError (400) MissingWalletAddress Wallet address is missing.
 *
 * @apiErrorExample  Bad Request response:
 *     HTTP 400 Bad Request
 *     {
 *       "error": "wallet address is missing"
 *     }
 */


// ------------------------------------------------------------------------------------------
// Current Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine UnauthorizedError
 * @apiVersion 1.0.0
 *
 * @apiError Unauthorized Only authenticated users can access the endpoint.
 *
 * @apiErrorExample  Unauthorized response:
 *     HTTP 401 Unauthorized
 *     {
 *       "message": "Invalid credentials"
 *     }
 */

// ------------------------------------------------------------------------------------------
// History.
// ------------------------------------------------------------------------------------------
