const router = require('express').Router();
const con = require('../../index.js').con;
const hub = require('hub');
const transformSunExposureToValue = require('./functions_PlantInfo.js').transformSunExposureToValue;

router.get('/', (req, res) =>
{
    const plant_id = req.headers["plant_id"];
    if (plant_id === undefined)
        res.status(400).json({ message: "Header values are incorrect" });
    else
    {
        con.query("SELECT ids_sun_exposure FROM plants WHERE id = " + plant_id).then(result => {
            if (result[0].length == 0)
            {
                res.status(401).json("This plant doesn't exist");
                return;
            }
            const ids = result[0][0].ids_sun_exposure;
            transformSunExposureToValue(ids).then(function (returnValue) { res.status(200).json(returnValue); },
            function (err) { res.status(500).json({ message: "Internal server error" }); throw err });
        }).catch(err => { res.status(500).json({ message: "Internal server error" }); throw err });
    }
});

module.exports = router;
