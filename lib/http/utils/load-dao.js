const fs = require('fs');
const path = require('path');

const daosDirectory = process.env.COINSENCE_DAOS_DIR || path.join(__dirname, '../../../', 'daos');

module.exports = function loadDao(spaceId) {
  return new Promise((resolve, reject) => {
    const daoPath = path.join(daosDirectory, `${spaceId}.json`);
    fs.readFile(daoPath, (err, dao) => {
      if (err) reject(err);
      else resolve(JSON.parse(dao));
    });
  });
}