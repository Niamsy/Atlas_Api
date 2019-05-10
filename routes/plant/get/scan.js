const router = require('express').Router();
const fetch = require('node-fetch');

const Plants = require('../../../models/plants/PlantsRepository');
const Users = require('../../../models/Users/UsersRepository');

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
          Authorization: 'Client-ID b16da1b2288b193'
        }
      }
    );
    if (!imgurResponse.ok) {
      res.status(400).json({ message: 'Imgur request failed.' });
      return;
    }
    const link = await imgurResponse.json();
    console.log(link.data.link);
    const plantnetResponse = await fetch(
      `https://my-api.plantnet.org/v1/identify/all?images=${encodeURIComponent(
        link.data.link
      )}&organs=${encodeURIComponent(organs)}&api-key=${encodeURIComponent(
        '2a10HX03PWHSwy3S2HcZGYh9e'
      )}`
    );
    if (!plantnetResponse.ok) {
      res.status(400).json({ message: 'Plantnet request failed.' });
      return;
    }
    const scientificName = await plantnetResponse.json().results[0].species
      .scientificNameWithoutAuthor;
    const result = await con.query(`SELECT *
              from plants where scientific_name = ${con.escape(scientificName)}`);
    if (result[0].length > 0) {
      res.send(scientificName);
    } else {
      res.status(404).json({ message: 'Plant not found in our database.' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
