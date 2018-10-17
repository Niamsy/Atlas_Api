/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UsersPlants', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    fkIdUser: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      field: 'fk_id_user'
    },
    fkIdPlant: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      field: 'fk_id_plant'
    },
    scannedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'scanned_at'
    }
  }, {
    tableName: 'users_plants'
  });
};
