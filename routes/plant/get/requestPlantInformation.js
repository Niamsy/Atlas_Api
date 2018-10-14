const router = require('express').Router();
const con = require('../../../index.js').con;
const hub = require('hub');

router.get('/', (req, res) => {
  const { api_token, request_id: id_request } = req.headers;

  if (id_request === undefined) {
    return res.status(400).json({ message: 'Header values are incorrect' });
  }
  const query_str = `SELECT * FROM plant_requests WHERE id = ${id_request}
    AND fk_id_user = ${con.escape(hub.connectedUserToken[api_token])}`;

  con
    .query(query_str)
    .then(result => {
      if (result[0].length === 0) {
        res.status(402).json({ message: 'No such request linked to this user' });
      } else {
        res.status(200).json({ message: 'Success', result: result[0][0] });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Atlas API encountered a issue', err: query_str });
    });
});

module.exports = router;
