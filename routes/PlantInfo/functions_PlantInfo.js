const KeysIds = {};

function loadCorrespondanceList(name, con) {
  con
    .query(`SELECT name FROM ${name} ORDER BY id ASC`)
    .then(result => {
      KeysIds[name] = result[0];
    })
    .catch(() => {
      console.error(`Couldn't load the Keys-Ids Correspondance list: ${name}`);
    });
}

function loadAllCorrespondanceList(con) {
  loadCorrespondanceList('soil_type', con);
  loadCorrespondanceList('soil_humidity', con);
  loadCorrespondanceList('soil_ph', con);
  loadCorrespondanceList('sun_exposure', con);
  loadCorrespondanceList('reproduction', con);
}

function transformIDSToValue(ids, name) {
  if (KeysIds[name] === undefined) {
    console.error(`Keys-Ids Correspondance list not loaded: ${name}`);
    return undefined;
  }

  let i = 0;
  const returnValue = {};
  for (let x = 0; x < KeysIds[name].length; x++) {
    if (ids[x] === '1') returnValue[i++] = KeysIds[name][x];
  }
  return returnValue;
}

function transformSoilTypeToValue(ids) {
  return transformIDSToValue(ids, 'soil_type');
}

function transformSoilHumidityToValue(ids) {
  return transformIDSToValue(ids, 'soil_humidity');
}

function transformSoilPHToValue(ids) {
  return transformIDSToValue(ids, 'soil_ph');
}

function transformSunExposureToValue(ids) {
  return transformIDSToValue(ids, 'sun_exposure');
}

function transformReproductionToValue(ids) {
  return transformIDSToValue(ids, 'reproduction');
}

module.exports = {
  transformSoilTypeToValue,
  transformSoilHumidityToValue,
  transformSoilPHToValue,
  transformSunExposureToValue,
  transformReproductionToValue,
  loadAllCorrespondanceList
};
