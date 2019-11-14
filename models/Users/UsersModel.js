/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'email'
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'date_of_birth'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      last_connection_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_connection_at'
      },
      right_id: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
        defaultValue: '1',
        references: {
          model: 'rights',
          key: 'id'
        },
        field: 'right_id'
      }
    },
    {
      tableName: 'users'
    }
  );
