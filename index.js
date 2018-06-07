const express = require('express')
const app = express()

const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
var crypto = require('crypto');
var SHA256 = require("crypto-js/sha256");

var cors = require('cors')

app.use(cors())

var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "phpmyadmin",
    password: "atlas2010",
    database: "Atlas"
});

connectedUserToken = []

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql.");
});

app.get('/', function(req, res) {
    res.send('Hello World! Hello DEMO ! Hello!')
})
 
app.get('/plant/:name', function(req, res) {
    var name = req.params.name.split('-').join(' ');
    con.query("SELECT * from plants where scientific_name = \'" + name + "\'", function(err, result, fields) {
	if (err) throw err;
	console.log(result);
	if (result.length > 0)
	    res.send('yes');
	else
	    res.send('no');
    })
})

app.post('/plant/add', function(req, res) {
    var api_token = req.header("api_token");
    var plantName = req.header("scientific_name");
    if (api_token == null || plantName == null) {
        res.status(400);
        res.send("Bad parameters");
        return;
    }
    if (connectedUserToken[api_token] == null)
    {
        res.status(401);
        res.send("Api token is wrong");
	return;
    }
    con.query("SELECT * from plants where scientific_name = \'" + plantName + "\'", function(err, result, fields) {
        if (err) {
            res.status(500)
            res.send("API error.")
            throw err;
        }
        if (result.length > 0)
        {
            var plant_id = result[0].id;
            var date = new Date();
            con.query("INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at) VALUES (" + connectedUserToken[api_token] + ", " + plant_id +", " + con.escape(date) + ")", function(err, result) {
                if (err) {
                    res.status(500)
                    res.send("API error.")
                    throw err;
                }
                res.status(200)
                res.send("Success.")
            });
        }
        else {
            res.status(500)
            res.send("API error.")
        }
    })
});

app.get('/plants/fetch', function(req, res) {

    var token = req.header('api_token');

	if (!token)
	{
		res.status(400);
		res.send("Header values are incorrect");
        return;
	}

    if (connectedUserToken[token] == null)
    {
        res.status(401);
        res.send("Api token is wrong");
	return;
    }

    con.query("SELECT plants.name, plants.scientific_name, plants.maxheight, plants.ids_reproduction, plants.ids_soil_type, plants.ids_soil_ph, plants.ids_soil_humididty, " +
                "plants.ids_sun_exposure, plants.ids_plant_container, plants.planting_period, plants.florering_period, " +
                "plants.harvest_period, plants.harvest_period, plants.cutting_period, plants.fk_id_frozen_tolerance," +
                " plants.fk_id_growth_rate, scanned_at FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant" +
                " where fk_id_user="+ connectedUserToken[token], function(err, result) {
	if (err) {
		res.status(500);
        res.send("Api encountered an issue");
		throw err;
    }

        res.status(200);
	    res.send(result);
    });
});

function generateToken() {
    var api_token = tokgen.generate();
    if (connectedUserToken[api_token] != null) {
        return generateToken();
    }
    return api_token;
};

app.post('/user/authentication', function(req, res) {
	var username = req.header("username");
	var password = req.header("password");
	
	if (username == null || password == null) {
		res.status(400);
		res.send("Header values are incorrect");
		return;
	}
	password = SHA256(password);
    con.query("SELECT id, name, password from users where name = \'" + username + "\' and password =\'" + password + "\'", function(err, result, fields) {
		if (err) {
			res.status(500);
			res.send("API error.");
			throw err;
		}
		if (result.length == 0) {
			res.status(400);
			res.send("Bad authentification");
			return;
        }
        for(var key in connectedUserToken) {
            if(connectedUserToken[key] == result[0].id) {
                res.status(200);
                res.send(JSON.stringify({ api_token: key}));
                return;
            }
        }
		if (password == result[0].password) {
            if (connectedUserToken) {
 			var api_token = generateToken();
            res.status(200);
            res.send(JSON.stringify({ api_token: api_token }));
		}
            connectedUserToken[api_token] = result[0].id;
            var dt = new Date()
            con.query("UPDATE users SET last_connection_at = " + con.escape(dt) + " WHERE id = \'" + connectedUserToken[api_token] + "\'"), function(err, result, fields) {
                console.log("update")
            }
			return;
		} else {
			res.status(400)
			res.send("Bad authentication");
			return;
		}
	});
});

app.listen(process.env.API_PORT, function() {
    console.log('Example app listening on port ' + process.env.API_PORT)
});
