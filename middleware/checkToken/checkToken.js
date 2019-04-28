const router = require('express').Router();
const hub = require('hub');

router.use((req, res, next) => {
  const { api_token: token } = req.headers;

  if (token === undefined) {
    res.status(400).json({ message: 'API TOKEN Header values are incorrect.' });
  } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[token] === undefined) {
    res.status(401).json({ message: 'Api token is wrong.' });
  } else {
    next();
  }
});

module.exports = router;
