const con = require('../../index.js').con;

function transformIDSToValue(ids, name)
{
    return (new Promise(function (resolve, reject) {
        // Do async job
        con.query("SELECT name FROM " + name + " ORDER BY id ASC").then(result => {
            let keys = result[0];
            let i = 0;
            let returnValue = {};
            for (let x = 0; x < keys.length; x++)
                if (ids[x] == 1)
                    returnValue[i++] = keys[x];
            resolve(returnValue);
        }).catch(err => { reject(err); })
    }));
}

function transformSoilTypeToValue(ids) {
    return (transformIDSToValue(ids, "soil_type"));
}

function transformSoilHumidityToValue(ids) {
    return (transformIDSToValue(ids, "soil_humidity"));
}

function transformSoilPHToValue(ids) {
    return (transformIDSToValue(ids, "soil_ph"));
}

function transformSunExposureToValue(ids) {
    return (transformIDSToValue(ids, "sun_exposure"));
}

function transformReproductionToValue(ids) {
    return (transformIDSToValue(ids, "reproduction"));
}

module.exports = {
    transformSoilTypeToValue: transformSoilTypeToValue,
    transformSoilHumidityToValue: transformSoilHumidityToValue,
    transformSoilPHToValue: transformSoilPHToValue,
    transformSunExposureToValue: transformSunExposureToValue,
    transformReproductionToValue: transformReproductionToValue
}
