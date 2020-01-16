const router = require('express').Router();
const fetch = require('node-fetch');
const querystring = require('querystring');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
/*  const { plant, organs } = req.body;
  if (!plant || !organs) {
    res.status(400).json({ message: 'Body values are incorrect.' });
    return;
  }

  const form = querystring.stringify({
    type: 'base64',
    image: plant
  });

  try {
    const imgurResponse = await fetch('https://api.imgur.com/3/upload', {
      method: 'POST',
      headers: {
        'Content-Length': form.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Client-ID b16da1b2288b193'
      },
      body: form
    });
    if (!imgurResponse.ok) {
      res.status(400).json({ message: 'Imgur request failed.' });
      return;
    }
    const imgurResponseJson = await imgurResponse.json();
    const { link } = imgurResponseJson.data;
    const plantnetResponse = await fetch(
      `https://my-api.plantnet.org/v1/identify/all?images=${encodeURIComponent(
        link
      )}&organs=${encodeURIComponent(organs)}&api-key=${encodeURIComponent(
        '2a10HX03PWHSwy3S2HcZGYh9e'
      )}`
    );
    if (!plantnetResponse.ok) {
      res.status(400).json({ message: 'Plantnet request failed.' });
      return;
    }
    const plantResponseJson = await plantnetResponse.json();
    const scientificName = plantResponseJson.results[0].species.scientificNameWithoutAuthor;*/

   // const result = await con.query(`SELECT *
     //         from plants where scientific_name = ${con.escape(scientificName)}`);
    //if (result[0].length === 0) {
     // res.status(404).json({ message: 'Plant not found in our database.' });
    //} else {
      res.status(200).json({ scientificName : "papaver rhoeas" });
    //}
  //} catch (err) {
     // res.status(500).json({ message: 'Api encountered an issue.' });
  //}
});

module.exports = router;
