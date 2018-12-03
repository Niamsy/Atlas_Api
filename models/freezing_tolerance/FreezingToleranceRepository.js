let FreezingTolerance = require('./FreezingToleranceModel.js');

const Op = Sequelize.Op;

module.exports = class FreezingToleranceRepository {
  static findAll() {
    return FreezingTolerance.findAll();
  }

  static findById(id) {
    return FreezingTolerance.findById(id);
  }

  static findByName(name) {
    return FreezingTolerance.findOne({ where: { name: name }});
  }
}
