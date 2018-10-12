/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('growthRate', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'name'
    }
  }, {
    tableName: 'growth_rate'
  });
};
