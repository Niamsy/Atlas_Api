const router = require('express').Router();
const fetch = require('node-fetch');
const { con } = require('../../../index.js');

const Plants = require('../../../models/plants/PlantsRepository');
const Users = require('../../../models/Users/UsersRepository');

router.post('/', async (req, res, next) => {
  console.log(req.body);
  const { plant, organs } = req.body;
  console.log(plant);
  console.log(organs);
  if (!plant || !organs) {
    res.status(400).json({ message: 'Body values are incorrect.' });
    return;
  }

  try {
    const imgurResponse = await fetch(
      `https://api.imgur.com/3/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID b16da1b2288b193'
        },
        body: {
          type: 'base64',
          image: plant
        }
      }
    );
    console.log(imgurResponse);
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
    console.log("Plantnet request");
    console.log(plantnetResponse);
    if (!plantnetResponse.ok) {
      res.status(400).json({ message: 'Plantnet request failed.' });
      return;
    }
    const plantResponseJson = await plantnetResponse.json();
    console.log(plantResponseJson);
    const scientificName = plantResponseJson.results[0].species.scientificNameWithoutAuthor;
    console.log(scientificName);
    const result = await con.query(`SELECT *
              from plants where scientific_name = ${con.escape(scientificName)}`);
    if (result[0].length > 0) {
      res.status(200).json({ scientificName });
    } else {
      res.status(404).json({ message: 'Plant not found in our database.' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
