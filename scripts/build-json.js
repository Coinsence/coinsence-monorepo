const fs = require('fs');
const path = require('path');

const contractsPath = path.join(__dirname, '..', 'build', 'contracts');
const libPath = path.join(__dirname, '..', 'lib');
const abisPath = path.join(libPath, 'abis');

const files = {
  Coin: 'apps/space/build/contracts/Space.json',
  Space: 'apps/coin/build/contracts/Coin.json',
  Kernel: 'apps/space/build/contracts/Kernel.json',
  ACL: 'apps/space/build/contracts/ACL.json'
};

Object.keys(files).forEach(contractName => {
  let file = JSON.parse(fs.readFileSync(`./${files[contractName]}`));
  let abiFile = path.join(abisPath, `${contractName}.json`);
  fs.writeFileSync(abiFile, JSON.stringify(file.abi));
});

console.log("Done, don't forget to reaload the JSON files from your application");
