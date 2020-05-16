/**
 * Script to run ETH funds distribution.
 * This script listen to specific coin tranfser events on Rinkeby from any address to a specific coinsence wallet
 * And send back to the sender Mainnet ETH equivalent coin_amount * coinToEthExchangeRate.
 * process.env.ETH_RINKEBY_PROVIDER_URL = Rinkeby node
 * process.env.ETH_MAINNET_PROVIDER_URL = Mainnet node
 * process.env.TOKEN = Coin address to listen to
 * process.env.COINSENCE_RECEIVER = Coinsence wallet address to receive the coins
 * process.env.COINSENCE_WALLET = Coinsence wallet private key to send ETH
 * process.env.EXCHANGE_RATE_EXPONENT = coin to ETH exchange rate exponent (e.g send 100 coin, receive 0.1ETH => 1 coin = 1e-3 ETH => exponent = 3)
 * Note: all coins deployed from Coinsence platform have 18 decimals.
 */
const Logger = require('logger').createLogger(); // logs to STDOUT
const ethers = require('ethers');
const ABI = require('../lib/abis/Coin.json');
const BigNumber = require('bignumber.js');
const { getGasPrice } = require("./gas-price");


(async () => {
    // get Rinkeby & Mainnet provider
    let ethRinkebyProvider, ethMainnetProvider;
    if (process.env.ETH_RINKEBY_PROVIDER_URL) {
        ethRinkebyProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RINKEBY_PROVIDER_URL);
    } else {
    ethRinkebyProvider = new ethers.getDefaultProvider('rinkeby');
    }
    ethMainnetProvider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA);

    // load wallet that contain ETH funds using private key
    let wallet = new ethers.Wallet(process.env.COINSENCE_WALLET);
    let signer = wallet.connect(ethMainnetProvider);
    // get current nonce
    let currentNonce = await ethMainnetProvider.getTransactionCount(signer.address);

    // get token instance
    const token = new ethers.Contract(process.env.TOKEN, ABI, ethRinkebyProvider);
    // filter token transfer events from any address to coinsence receiver address
    const filter = token.filters.Transfer(null, process.env.COINSENCE_RECEIVER);
    token.on(filter, async (from, to, value, event) => {
        // ignore mint function event
        if((from != "0x0000000000000000000000000000000000000000") && (from != to)) {
            // wait for coin tx
            await ethRinkebyProvider.waitForTransaction(event.transactionHash);

            Logger.info(`Received ${value.toString() / 10**18} coins from ${from} in Transaction ${event.transactionHash}`);

            // calculate amount of ETH to send back
            let weiAmount = new BigNumber(value.toString()).multipliedBy(new BigNumber(10**-process.env.EXCHANGE_RATE_EXPONENT));
            let ethAmount = ethers.utils.formatEther(String(weiAmount));

            let ethSignerBalance = ethers.utils.formatEther(String(
                new BigNumber((await signer.getBalance()).toString())
            ));

            if(ethAmount >= ethSignerBalance) {
                Logger.setLevel("error");
                Logger.error("ETH value too HIGH!");    
            }
            else {
                Logger.info(`Sending ${ethAmount} to ${from}`);

                // get current gas price for 2min tx
                let gasPrice = await getGasPrice(2);

                if(gasPrice != null) {
                    // tx object
                    let transaction = {
                        to: from,
                        value: ethers.utils.parseEther(ethAmount)
                    };
                    // estimate gas cost
                    //let gasEstimation = await ethMainnetProvider.estimateGas(transaction);
                    //let gasCostEstimation = gasPrice.mul(gasEstimation);
                    //transaction.gasPrice = gasCostEstimation;

                    // manage nonce
                    transaction.nonce = currentNonce;

                    try {
                        signer.sendTransaction(transaction).then((tx) => {
                            currentNonce++;

                            Logger.info(`Sent ${ethAmount} to ${from} in Transaction: ` + tx.hash);

                        })
                    }
                    catch(err) {
                        Logger.setLevel("error");
                        Logger.error(`Can't send transaction from: ${signer.address} to: ${from}`);
                        Logger.error(err);
                    }    
                }
                else {
                    Logger.setLevel("error");
                    Logger.error("Can not fetch gas price");    
                }
            }
        }
    });

})();