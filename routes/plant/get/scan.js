const router = require('express').Router();
const fetch = require('node-fetch');
const { con } = require('../../../index.js');

const querystring = require('querystring');
const request = require('request');

const Plants = require('../../../models/plants/PlantsRepository');
const Users = require('../../../models/Users/UsersRepository');

router.post('/', async (req, res, next) => {
  const { plant, organs } = req.body;
  if (!plant || !organs) {
    res.status(400).json({ message: 'Body values are incorrect.' });
    return;
  }

  let form = querystring.stringify({
    'type': 'base64',
    'image': plant
  });

  try {
    let link;
    console.log('request');
    request({
      headers: {
        'Content-Length': form.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Client-ID b16da1b2288b193'
      },
      uri: 'https://api.imgur.com/3/upload',
      body: form,
      method: 'POST'
    }, function(err, resp, body) {
      body = JSON.parse(body);
      if (body.success) {
        link = body.data.link;
      }
    });
    console.log(link);
    if (!link) {
      res.status(400).json({ message: 'Imgur request failed.' });
      return;
    }
    console.log(link);
    const plantnetResponse = await fetch(
      `https://my-api.plantnet.org/v1/identify/all?images=${encodeURIComponent(
        link
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
    console.log(err);
    next(err);
  }
});

module.exports = router;
