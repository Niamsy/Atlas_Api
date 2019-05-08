let SunExposure = require('./SunExposureModel.js');

const Op = Sequelize.Op;

module.exports = class SunExposureRepository {
  static findAll() {
    return SunExposure.findAll();
  }

  static findById(id) {
    return SunExposure.findById(id);
  }

  static findByName(name) {
    return SunExposure.findOne({ where: { name: name }});
  }
}
