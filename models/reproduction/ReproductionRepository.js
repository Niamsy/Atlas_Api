let Reproduction = require('./ReproductionModel.js');

const Op = Sequelize.Op;

module.exports = class ReproductionRepository {
  static findAll() {
    return Reproduction.findAll();
  }

  static findById(id) {
    return Reproduction.findById(id);
  }

  static findByName(name) {
    return Reproduction.findOne({ where: { name: name }});
  }
}
