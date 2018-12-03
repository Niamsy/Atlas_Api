let SoilPH = require('./SoilPHModel.js');

const Op = Sequelize.Op;

module.exports = class SoilPHRepository {
  static findAll() {
    return SoilPH.findAll();
  }

  static findById(id) {
    return SoilPH.findById(id);
  }

  static findByName(name) {
    return SoilPH.findOne({ where: { name: name }});
  }
}
