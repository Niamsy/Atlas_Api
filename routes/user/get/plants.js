const router = require('express').Router();
var hub = require('hub');
const con = require('../../../index.js').con;


router.get('/', (req, res) => {
    const {api_token: token} = req.headers;

    con.query("SELECT plants.id, scanned_at FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant" +
        " where fk_id_user=" + hub.connectedUserToken[token]).then(result => {
        res.status(200);
        res.json(result[0]);
    }).catch(err => {
        res.status(500);
        res.json({message: "Api encountered an issue: +" + err});
    });
});

module.exports = router;
