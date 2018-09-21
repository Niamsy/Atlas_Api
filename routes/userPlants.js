const router = require('express').Router();
var hub      = require('hub');
const con    = require('../index.js').con;


router.get('/', (req, res) => {
    const token = req.header('api_token');
    if (!token) {
        res.status(400);
        res.json({message: "Header values are incorrect"});
    } else if (hub.connectedUserToken[token] === undefined) {
        res.status(401);
        res.json({message: "Api token is wrong"});
    } else {
        con.query("SELECT plants.id, scanned_at FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant" +
            " where fk_id_user="+ hub.connectedUserToken[token]).then(result => {
            res.status(200);
            res.json(result[0]);
        }).catch(err => {
            res.status(500);
            res.json({message: "Api encountered an issue: +" + err});
        });
    }
});

module.exports = router;
