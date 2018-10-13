const router = require('express').Router();

// middleware
const checkToken = require('../middleware/checkToken/checkToken');
const isAdmin = require('../middleware/isAdmin/isAdmin');

// Plant POST routes
router.use('/plant/add', require('./plant/post/add'));
router.use('/plant/create', [checkToken, isAdmin], require('./plant/post/createPlant'));
router.use('/plant/request/create', checkToken, require('./plant/post/requestForNewPlant'));

// Plant GET routes
router.use('/plants/fetch', checkToken, require('./plant/get/fetch'));
router.use('/plant/info', require('./plant/get/info'));
router.use('/plant/request/fetch', require('./plant/get/fetchRequestNewPlant'));
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

module.exports = router;