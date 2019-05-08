const Plants = require('./PlantsModel.js');

module.exports = class PlantsRepository {
  static findAll() {
    return Plants.findAll();
  }

  static findAllById(id) {
    return Plants.findById({ where: { id } });
  }

  static findAllByName(name) {
    return Plants.findOne({ where: { name } });
  }

  static findAllByScientificName(scientificName) {
    return Plants.findAll({ where: { scientificName } });
  }
};
