const router = require('express').Router();

const hub = require('hub');

router.post('/', (req, res) => {
  const { api_token } = req.headers;

  delete hub.connectedUserToken[api_token];
  res.status(200).json({ message: 'Disconnection success' });
});

module.exports = router;
