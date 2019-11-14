const { sequelize, Sequelize } = require('../../database/sequelize');
const Users = require('./UsersModel.js')(sequelize, Sequelize);

module.exports = class UsersRepository {
  static findAll() {
    return Users.findAll();
  }

  static findById(id) {
    return Users.findByPk(id);
  }

  static findByName(name) {
    return Users.findOne({ where: { name } });
  }

  static findByEmail(email) {
    return Users.findOne({ where: { email } });
  }
};
