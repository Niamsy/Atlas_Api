const Users = require('./UsersModel.js');

module.exports = class UsersRepository {
  static findAll() {
    return Users.findAll();
  }

  static findById(id) {
    return Users.findById(id);
  }

  static findByName(name) {
    return Users.findOne({ where: { name } });
  }

  static findByEmail(email) {
    return Users.findOne({ where: { email } });
  }
};