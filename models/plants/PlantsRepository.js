const Plants = require('./PlantsModel.js');

module.exports = class PlantsRepository {
  static findAll() {
    return Plants.findAll();
  }

  static findAllById(id) {
    return Plants.findAll({ where: { id } });
  }

  static findAllByName(name) {
    return Plants.findAll({ where: { name } });
  }

  static findAllByScientificName(scientificName) {
    return Plants.findAll({ where: { scientificName } });
  }
};
