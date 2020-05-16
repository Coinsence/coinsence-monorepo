const axios = require('axios');
const utils = require('ethers').utils;

const getGasPrice = async (maxWait) => {
    try {
      const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const data = response.data.gasPriceRange;
      const price = Object.keys(data).find(price => parseFloat(data[price]) <= maxWait);
      return utils.parseUnits(`${(price || response.data.fast) / 10}`, 'gwei');
    } catch (error) {
      return null;
    }
}

module.exports = {
    getGasPrice
};