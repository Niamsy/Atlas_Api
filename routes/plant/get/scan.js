const router = require('express').Router();
const fetch = require('node-fetch');

const Plants = require('../../../models/plants/PlantsRepository');

router.get('/', async (req, res, next) => {
  const { plant, organs } = req.headers;
  if (!plant || !organs) {
    res.status(400).json({ message: 'Header values are incorrect.' });
    return;
  }

  try {
    const imgurResponse = await fetch(
      `https://api.imgur.com/3/upload?image=${encodeURIComponent(plant)}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 12b0fdb7a3a8d40'
        }
      }
    );
    if (!imgurResponse.ok) {
      res.status(200).json({ message: 'Coquelicot' });
      return;
    }
    const plantnetResponse = await fetch(
      `https://my-api.plantnet.org/v1/identify/all?images=${encodeURIComponent(
        imgurResponse.json().data.link
      )}&organs=${encodeURIComponent(organs)}&api-key=${encodeURIComponent()}`
    );
    if (!plantnetResponse.ok) {
      res.status(400).json({ message: 'Plantnet request failed.' });
      return;
    }
    const scientificName = await plantnetResponse.json().results[0].species
      .scientificNameWithoutAuthor;
    const result = await Plants.findAllByScientificName(scientificName);
    if (result[0].length > 0) {
      res.send(scientificName);
    } else {
      res.status(404).json({ message: 'Plant not found in our database.' });
      return;
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
