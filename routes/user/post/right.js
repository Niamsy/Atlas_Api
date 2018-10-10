const router = require('express').Router();
var hub = require('hub');
const con = require('../../../index.js').con;


router.post('/', async (req, res) => {
    const {right_id, email} = req.body;

    if (right_id === undefined || email === undefined || right_id < 1 || right_id > 2) {
        res.status(400).json({message: "Body values are incorrect."});
    } else {
        con.query("UPDATE users SET right_id=" + con.escape(right_id) + " WHERE email=" + con.escape(email))
            .then(result => res.status(200).json({message: "Success"}))
            .catch(err => res.status(500).json({message: "Api encountered an issue : " + err.message}));
    }
});

module.exports = router;
