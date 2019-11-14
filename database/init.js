const { sequelize } = require('./sequelize');
const plantInfo = require('../routes/PlantInfo/functions_PlantInfo.js');

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
    plantInfo.loadAllCorrespondanceList(sequelize);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

