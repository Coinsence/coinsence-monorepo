const Base = require('./base');

class Member extends Base {

  all() {
    return this.functions.membersCount().then(count => {
      let members = [];
      for (let id = 1; id <= count; id++) {
        members.push(this.getById(id));
      }

      return Promise.all(members);
    });
  }

  getById(id) {
    // todo get IPFS data
    return this.functions.getMemberById(id);
  }

  getByAddress(address) {
    return this.functions.getMemberIdByAddress(address).then(id => {
      return this.functions.getById(id);
    });
  }
}

module.exports = Member;
