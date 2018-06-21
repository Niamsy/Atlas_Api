const router = require('express').Router();
const con    = require('../index.js').con;

router.get('/', (req, res) => {
    const plant_id = req.header('plant_id');

    if (!plant_id) {
        res.status(400);
        res.json({message: "Header values are incorrect"});
    } else {
        con.query("SELECT name, scientific_name, maxheight, ids_reproduction, ids_soil_type, ids_soil_ph, plants.ids_soil_humidity, " +
            "ids_sun_exposure, ids_plant_container, planting_period, florering_period, " +
            "harvest_period, harvest_period, cutting_period, fk_id_frozen_tolerance," +
            " fk_id_growth_rate FROM plants where id=" + plant_id).then(result => {
                if (result[0].length <= 0) {
                    res.status(404);
                    res.json({message: "The plant requested doesn't exist"});
                }
                else {
                    res.status(200);
                    res.json(result[0][0]);
                }
        }).catch(err => {
            res.status(500);
            res.json({message: "Api encountered an issue: +" + err});
        })
    }
});

module.exports = router;