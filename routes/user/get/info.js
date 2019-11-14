const router = require('express').Router();
const hub = require('hub');

const Users = require('../../../models/Users/UsersRepository');

router.get('/', async (req, res, next) => {
  const { api_token: apiToken } = req.headers;

  try {
    const result = await Users.findById(hub.connectedUserToken[apiToken]);
    if (result) {
      res.status(200).json(result);
      return;
    }
    res.status(404).json({ message: 'Not found' });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

module.exports = router;
