let SoilType = require('./SoilTypeModel.js');

const Op = Sequelize.Op;

module.exports = class SoilTypeRepository {
  static findAll() {
    return SoilType.findAll();
  }

  static findById(id) {
    return SoilType.findById(id);
  }

  static findByName(name) {
    return SoilType.findOne({ where: { name: name }});
  }
}
