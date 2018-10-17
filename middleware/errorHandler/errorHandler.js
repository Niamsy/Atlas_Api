const router = require('express').Router();

router.use((err, req, res, next) => res.status(500).json({ message: 'Api encountered an issue.' }));

module.exports = router;
