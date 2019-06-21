const fs = require('fs');
const path = require('path');

const daosDirectory = process.env.COINSENCE_DAOS_DIR || path.join(__dirname, '../../../', 'daos');

module.exports = function saveDao(spaceId, dao) {
  return new Promise((resolve, reject) => {
    const daoPath = path.join(daosDirectory, `${spaceId}.json`);
    fs.writeFile(daoPath, dao, { flag: 'ax' }, (err) => {
      if (err) reject(err);
      else resolve(dao);
    });
  })
}
