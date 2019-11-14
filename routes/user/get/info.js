const router = require('express').Router();
const hub = require('hub');

const Users = require('../../../models/Users/UsersRepository');

router.get('/', async (req, res, next) => {
  const { api_token: apiToken } = req.headers;

  try {
    const result = await Users.findById(hub.connectedUserToken[apiToken]);
    if (result[0].length > 0) {
      res.status(200).json(result[0][0]);
      return;
    }
    res.status(404).json({ message: 'Not found' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
