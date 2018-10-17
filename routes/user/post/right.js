const router = require('express').Router();
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { right_id, email } = req.body;

  if (right_id === undefined || email === undefined || right_id < 1 || right_id > 2) {
    return res.status(400).json({ message: 'Body values are incorrect.' });
  }
  try {
    await con.query(
      `UPDATE users SET right_id=${con.escape(right_id)} WHERE email=${con.escape(email)}`
    );
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
