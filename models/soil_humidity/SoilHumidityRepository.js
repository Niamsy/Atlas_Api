let SoilHumidity = require('./SoilHumidityModel.js');

const Op = Sequelize.Op;

module.exports = class SoilHumidityRepository {
  static findAll() {
    return SoilHumidity.findAll();
  }

  static findById(id) {
    return SoilHumidity.findById(id);
  }

  static findByName(name) {
    return SoilHumidity.findOne({ where: { name: name }});
  }
}
