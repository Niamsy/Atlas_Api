const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { api_token, request_id: id_request } = req.headers;

  if (id_request === undefined) {
    return res.status(400).json({ message: 'Header values are incorrect' });
  }

  try {
    const result = await con.query(`SELECT * FROM plant_requests WHERE id = ${id_request}
    AND fk_id_user = ${con.escape(hub.connectedUserToken[api_token])}`);
    if (result[0].length === 0) {
      return res.status(402).json({ message: 'No such request linked to this user' });
    }
    return res.status(200).json({ message: 'Success', result: result[0][0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
