const router = require('express').Router();
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { role_id } = req.headers;

  if (!role_id) {
    return res.status(400).json({ message: 'Header values are incorrect.' });
  }
  try {
    const result = await con.query(`SELECT name
              FROM rights where id =${role_id}`);
    if (result[0].length <= 0) {
      return res.status(404).json({ message: "The role requested doesn't exist" });
    }
    return res.status(200).json(result[0][0].name);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
