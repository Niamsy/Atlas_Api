const router = require('express').Router();

// Plant POST routes
router.use('/plant/add', require('./plant/post/add'));

// Plant GET routes
router.use('/plants/fetch', require('./plant/get/fetch'));
router.use('/plant/info', require('./plant/get/info'));
router.use('/plant/:name', require('./plant/get/exist'));

// User POST routes
router.use('/user/authentication', require('./user/post/authentication'));
router.use('/user/updatePassword', require('./user/post/updatePassword'));
router.use('/user/resetPassword', require('./user/post/resetPassword'));
router.use('/user/disconnection', require('./user/post/disconnection'));
router.use('/user/registration', require('./user/post/registration'));
router.use('/user/right', require('./user/post/right'));

// User GET routes
router.use('/user/plants', require('./user/get/plants'));
router.use('/user/info', require('./user/get/info'));

// Role GET routes
router.use('/role', require('./role/get/role'));

module.exports = router;