/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Reproduction',
    {
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
    },
    {
      tableName: 'reproduction'
    }
  );
