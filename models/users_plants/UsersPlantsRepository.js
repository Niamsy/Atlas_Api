let UserPlants = require('./UserPlantsModel.js');

const Op = Sequelize.Op;

module.exports = class UsersPlantsRepository {
  static findAll() {
    return UserPlants.findAll();
  }

  static findAllByUser(idUser) {
    return UserPlants.findAll({ where: { fkIdUser: idUser }});
  }

  static findAllByPlant(idPlant) {
    return UserPlants.findAll({ where: { fkIdPlant: idPlant }});
  }

  static findAllByPlantAndUser(idPlant, idUser) {
    return UserPlants.findAll({ where: { fkIdPlant: idPlant, fkIdUser: idUser }});
  }

  static countAllByUser(idUser) {
    return UserPlants.count({ where: { fkIdUser: idUser }});
  }

  static countAllByPlant(idPlant) {
    return UserPlants.count({ where: { fkIdPlant: idPlant }});
  }

  static countAllByPlantAndUser(idPlant, idUser) {
    return UserPlants.count({ where: { fkIdPlant: idPlant, fkIdUser: idUser }});
  }

  static findAllScannedAt(date) {
    return UserPlants.findAll({ where: { scannedAt: { [Op.like]: '%' + date + '%' }}});
  }

  static findAllScannedToday() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? '0' + month : month);
    let day = date.getDate();
    day = (day < 10 ? '0' + day : day);
    return findAllScannedAt(year + '-' + month + '-' + day);
  }
}
