const router = require('express').Router();
var hub      = require('hub');
const con    = require('../../../index.js').con;


router.post('/', async (req, res) => {
    const { api_token: token, right_id, email } = req.body;

    if (token === undefined || right_id === undefined || email === undefined || right_id < 1 || right_id > 2) {
        res.status(400).json({message: "Header values are incorrect"});
    } else if (token === undefined || hub.connectedUserToken[token] === undefined) {
        res.status(401).json({message: "Api token is wrong"});
    } else {
        con.query("SELECT * FROM users WHERE id=" + con.escape(hub.connectedUserToken[token]) + " AND right_id=1")
        .then(result => {
            if (result[0].length > 0) {
                con.query("UPDATE users SET right_id=" + con.escape(right_id) + " WHERE email=" + con.escape(email))
                .then(result => res.status(200).json({message: "Success"}))
                .catch(err => res.status(500).json({message: "Api encountered an issue : " + err.message}));
            } else {
                res.status(401).json({message: "You need to be admin to modify right id"});
            }
        })
        .catch((err) => res.status(500).json({message: "Api encountered an issue : " + err.message}));
    }
});

module.exports = router;
