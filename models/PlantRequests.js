/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plantRequests', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    fkIdUser: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'fk_id_user'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name'
    },
    scientificName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'scientific_name'
    },
    maxHeight: {
      type: "DOUBLE",
      allowNull: false,
      field: 'max_height'
    },
    idsReproduction: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '00000',
      field: 'ids_reproduction'
    },
    idsSoilType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '00000',
      field: 'ids_soil_type'
    },
    idsSoilPh: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '000',
      field: 'ids_soil_ph'
    },
    idsSoilHumidity: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '0000',
      field: 'ids_soil_humidity'
    },
    idsSunExposure: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '000',
      field: 'ids_sun_exposure'
    },
    idsPlantContainer: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '00',
      field: 'ids_plant_container'
    },
    plantingPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'planting_period'
    },
    floreringPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'florering_period'
    },
    harvestPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'harvest_period'
    },
    cuttingPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'cutting_period'
    },
    fkIdFrozenTolerance: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'freezing_tolerance',
        key: 'id'
      },
      field: 'fk_id_frozen_tolerance'
    },
    fkIdGrowthRate: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'growth_rate',
        key: 'id'
      },
      field: 'fk_id_growth_rate'
    },
    growthDuration: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: '0',
      field: 'growth_duration'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'SENT',
      field: 'status'
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    tableName: 'plant_requests'
  });
};
