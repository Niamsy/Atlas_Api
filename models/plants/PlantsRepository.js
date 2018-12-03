let Plants = require('./PlantsModel.js');

const Op = Sequelize.Op;

module.exports = class PlantsRepository {
  static findAll() {
    return Plants.findAll();
  }

  static findAllById(id) {
    return Plants.findAll({ where: { id: id }});
  }

  static findAllByName(name) {
    return Plants.findAll({ where: { name: name }});
  }

  static countAllByScientificName(scientificName) {
    return Plants.findAll({ where: { scientificName: scientificName }});
  }
}
