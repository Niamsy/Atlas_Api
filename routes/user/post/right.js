const router = require('express').Router();
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { right_id: rightId, email } = req.body;

  if (rightId === undefined || email === undefined || rightId < 1 || rightId > 2) {
    return res.status(400).json({ message: 'Body values are incorrect.' });
  }
  try {
    await con.query(
      `UPDATE users SET right_id=${con.escape(rightId)} WHERE email=${con.escape(email)}`
    );
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
