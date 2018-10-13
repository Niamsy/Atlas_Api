const router         = require('express').Router();
const con            = require('../index.js').con;
const hub            = require('hub');
const nodemailer     = require('nodemailer');
const config         = require('config');

router.post('/', (req, res) =>
{
    const body = req.body;
    const api_token = req.header("api_token");
    
    if (body["id_request"] === undefined || body["status"] === undefined)
    {
        res.status(400);
        res.json({ message: "Body values are incorrect" });
        return;
    }

    const id_request = con.escape(body["id_request"]);

    if (api_token === undefined || hub.connectedUserToken[api_token] === undefined)
    {
        res.status(401);
        res.json({ message: "API token is invalid or empty" });
        return;
    }
    
    con.query("SELECT rights.name FROM rights INNER JOIN users ON users.right_id = rights.id WHERE users.id = '" + hub.connectedUserToken[api_token] + "'").then(result =>
    {
        if (result[0].length == 0 || result[0][0]['name'] != "admin")
        {
            res.status(402).json({ message: "The API Token doesn't belong to an admin", result : result[0] });
            return;
        }
        con.query("SELECT users.email, plant_requests.* FROM plant_requests INNER JOIN users ON users.id = plant_requests.fk_id_user WHERE plant_requests.id = " + id_request).then(request =>
        {
            if (request[0].length == 0)
            {
                res.status(403).json({ message: "No request with the given request_id exists" });
                return;
            }
            const email = request[0][0]['email'];

            const new_status = ((body["status"] == true) ? (2) : (3));
            con.query("UPDATE plant_requests SET status = " + new_status + " WHERE id = " + id_request).then(result =>
            {
                const smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: config.email,
                        pass: config.password_gmail,
                    }
                });

                const request_value = request[0][0];

                const mail =
                {
                    from: config.email,
                    to: email,
                    subject: 'Response to your request',
                    html: 'Your request (ID: ' + request_value.id + ') was ' + ((new_status == 2) ? ('accepted') : ('declined'))
                        + '<br \>Value of the plant requested: '
                        + '<br \>   <b>Name</b>                    :   ' + request_value.name
                        + '<br \>   <b>Scientific name</b>         :   ' + request_value.scientific_name
                        + '<br \>   <b>Max height</b>              :   ' + request_value.max_height
                        + '<br \>   <b>IDs of the soil PH</b>      :   ' + request_value.ids_soil_ph
                        + '<br \>   <b>IDs of soil type</b>        :   ' + request_value.ids_soil_type
                        + '<br \>   <b>IDs of sun exposure</b>     :   ' + request_value.ids_sun_exposure
                        + '<br \>   <b>IDs of soil humidity</b>    :   ' + request_value.ids_soil_humidity
                        + '<br \>   <b>IDs of reproduction</b>     :   ' + request_value.ids_reproduction
                        + '<br \>   <b>IDs of plant containe</b> r :   ' + request_value.ids_plant_container
                        + '<br \>   <b>Planting period</b>         :   ' + request_value.planting_period
                        + '<br \>   <b>Florering period</b>        :   ' + request_value.florering_period
                        + '<br \>   <b>Harvest period</b>          :   ' + request_value.harvest_period
                        + '<br \>   <b>Cutting period</b>          :   ' + request_value.cutting_period
                        + '<br \>   <b>ID frozen tolerance</b>     :   ' + request_value.fk_id_frozen_tolerance
                        + '<br \>   <b>ID growth rate</b>          :   ' + request_value.fk_id_growth_rate
                };

                smtpTransport.sendMail(mail, (error) =>
                {
                    if (error)
                        res.status(201).json({ message: "Error while sending the mail" });
                    else
                        res.status(200).json({ message: "Success" });
                    smtpTransport.close();
                });
            }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue" }); throw err })
        }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue" }); throw err })
    }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue" }); throw err })
});

module.exports = router;
