// help, give me a better name

const fs = require('fs');
module.exports = function (file, networkId, data) {
  let content = JSON.parse(fs.readFileSync(file));
  content[networkId] = data;
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}
