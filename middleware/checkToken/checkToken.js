const router = require('express').Router();
const hub = require('hub');

router.use((req, res, next) => {
  const {api_token: token} = req.headers;

  if (token === undefined) {
    return res.status(400).json({message: "Header values are incorrect."});
  } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[token] === undefined) {
    return res.status(401).json({message: "Api token is wrong."});
  }
  next();
});

module.exports = router;