const router = require('express').Router();
const con = require('../index.js').con;


router.get('/', function(req, res) {
    const name = req.params.name.split('-').join(' ');
    con.query("SELECT * from plants where scientific_name = \'" + name + "\'").then(result => {
        if (result[0].length > 0) {
            res.send('yes');
        } else {
            res.send('no');
        }
    }).catch(err => {
        res.status(500);
        res.json({message: "Api encountered an issue: " + err});
    });
});

module.exports = router;
