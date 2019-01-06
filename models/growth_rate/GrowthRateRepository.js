let GrowthRate = require('./GrowthRateModel.js');

const Op = Sequelize.Op;

module.exports = class GrowthRateRepository {
  static findAll() {
    return GrowthRate.findAll();
  }

  static findById(id) {
    return GrowthRate.findById(id);
  }

  static findByName(name) {
    return GrowthRate.findOne({ where: { name: name }});
  }
}
