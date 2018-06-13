const router = require('express').Router();

router.get('/', function(req, res) {
    const name = req.params.name.split('-').join(' ');
    con.query("SELECT * from plants where scientific_name = \'" + name + "\'").then(result => {
        if (result[0].length > 0) {
            res.send('yes');
        } else {
            res.send('no');
        }
    }).catch(err => {
        throw err
    });
});

module.exports = router;
