const router = require('express').Router();
const hub = require('hub');

const {con} = require('../../index');

router.use(async (req, res, next) => {
  const {api_token: token} = req.headers;

  try {
    const admin = await con.query(`SELECT * FROM users WHERE id=${con.escape(hub.connectedUserToken[token])} AND right_id=1`);
    if (admin[0].length === 0) {
      return res.status(401).json({message: "You need to be admin."});
    }
  } catch (e) {
    return res.status(500).json({message: "Api encountered an issue : " + err.message});
  }
  next();
});

module.exports = router;