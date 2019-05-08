const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { api_token: apiToken, request_id: idRequest } = req.headers;

  if (idRequest === undefined) {
    res.status(400).json({ message: 'Header values are incorrect' });
    return;
  }

  try {
    const result = await con.query(`SELECT * FROM plant_requests WHERE id = ${idRequest}
    AND fk_id_user = ${con.escape(hub.connectedUserToken[apiToken])}`);
    if (result[0].length === 0) {
      res.status(402).json({ message: 'No such request linked to this user' });
      return;
    }
    res.status(200).json({ message: 'Success', result: result[0][0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
