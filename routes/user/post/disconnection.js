const router = require('express').Router();

const hub = require('hub');

router.post('/', (req, res) => {
  const { api_token: apiToken } = req.headers;

  delete hub.connectedUserToken[apiToken];
  return res.status(200).json({ message: 'Disconnection success' });
});

module.exports = router;
