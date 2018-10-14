const router = require('express').Router();
const con = require('../../../index.js').con;

router.get('/', (req, res) => {
  const { role_id } = req.headers;

  if (!role_id) {
    res.status(400).json({ message: 'Header values are incorrect.' });
  } else {
    con
      .query('SELECT name FROM rights where id=' + role_id)
      .then(result => {
        if (result[0].length <= 0) {
          res.status(404).json({ message: "The role requested doesn't exist" });
        } else {
          res.status(200).json(result[0][0]['name']);
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Api encountered an issue: +' + err });
      });
  }
});

module.exports = router;
