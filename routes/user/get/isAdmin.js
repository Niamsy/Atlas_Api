const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { api_token } = req.headers;

  try {
    const result = await con.query(
      `SELECT rights.name
           FROM rights,
                users
          WHERE rights.id = users.right_id
            AND users.id = ${hub.connectedUserToken[api_token]}`
    );
    if (result[0].length > 0) {
      return res.status(200).json({ isAdmin: result[0][0].name === 'admin' });
    }
    return res.status(404).json({ message: 'Not found' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
