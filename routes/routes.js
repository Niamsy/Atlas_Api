const router = require('express').Router();

// middleware
const checkToken = require('../middleware/checkToken/checkToken');
const isAdmin = require('../middleware/isAdmin/isAdmin');
const errorHandler = require('../middleware/errorHandler/errorHandler');
const checkParams = require('../middleware/checkParams/checkParams');

// Plant POST routes
router.use(
  '/plant/add',
  [checkToken, checkParams(['scientific_name'])],
  require('./plant/post/add')
);
router.use('/plant/create', [checkToken, isAdmin], require('./plant/post/createPlant'));
router.use('/plant/request/create', checkToken, require('./plant/post/requestForNewPlant'));

router.use(
  '/plant/request/response',
  [checkToken, isAdmin, checkParams(['id_request', 'status', 'sendMail'])],
  require('./plant/post/requestPlantResponse')
);
router.use(
  '/plant/request/information',
  [checkToken],
  require('./plant/get/requestPlantInformation')
);

// Plant GET routes
router.use('/plants/fetch', checkToken, require('./plant/get/fetch'));
router.use('/plant/info', require('./plant/get/info'));
router.use(
  '/plant/request/fetch',
  [checkToken, isAdmin],
  require('./plant/get/fetchRequestNewPlant')
);
router.use('/plant/:name', require('./plant/get/exist'));

// User POST routes
router.use('/user/authentication', require('./user/post/authentication'));
router.use('/user/resetPassword', require('./user/post/resetPassword'));
router.use('/user/registration', require('./user/post/registration'));

router.use('/user/updatePassword', checkToken, require('./user/post/updatePassword'));
router.use('/user/disconnection', checkToken, require('./user/post/disconnection'));
router.use('/user/right', [checkToken, isAdmin], require('./user/post/right'));

router.use('/user/glossary', checkToken, require('./user/get/glossary'));
router.use('/user/isAdmin', checkToken, require('./user/get/isAdmin'));

// User GET routes
router.use('/user/plants', checkToken, require('./user/get/plants'));
router.use('/user/info', checkToken, require('./user/get/info'));

// Role GET routes
router.use('/role', require('./role/get/role'));

// TODO /plant/info/:type
router.use('/plantInfo/reproduction', require('./PlantInfo/get/plantReproduction'));
router.use('/plantInfo/soilHumidity', require('./PlantInfo/get/plantSoilHumidity'));
router.use('/plantInfo/soilType', require('./PlantInfo/get/plantSoilType'));
router.use('/plantInfo/soilPH', require('./PlantInfo/get/plantSoilPH'));
router.use('/plantInfo/sunExposure', require('./PlantInfo/get/plantSunExposure'));

// Middleware to catch error
router.use(errorHandler);

module.exports = router;
