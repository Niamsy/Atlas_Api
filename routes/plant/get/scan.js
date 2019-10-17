const router = require('express').Router();

router.post('/', async (req, res, next) => {
  const { plant, organs } = req.body;
  if (!plant || !organs) {
    res.status(400).json({ message: 'Body values are incorrect.' });
    return;
  }
  res.status(200).json({ scientificName: "bellis perennis" });
});

module.exports = router;
