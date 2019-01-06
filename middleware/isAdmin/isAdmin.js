const router = require('express').Router();
const hub = require('hub');

const { con } = require('../../index');

router.use(async (req, res, next) => {
  const { api_token: token } = req.headers;

  try {
    const admin = await con.query(
      `SELECT * FROM users WHERE id=${con.escape(hub.connectedUserToken[token])} AND right_id=1`
    );
    if (admin[0].length === 0) {
      res.status(401).json({ message: 'You need to be admin.' });
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
