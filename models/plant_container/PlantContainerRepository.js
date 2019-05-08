let PlantContainer = require('./PlantContainerModel.js');

const Op = Sequelize.Op;

module.exports = class PlantContainerRepository {
  static findAll() {
    return PlantContainer.findAll();
  }

  static findById(id) {
    return PlantContainer.findById(id);
  }

  static findByName(name) {
    return PlantContainer.findOne({ where: { name: name }});
  }
}
