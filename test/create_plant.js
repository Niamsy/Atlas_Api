process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/Post plant/create', () => {

    it('It should returns bad header values', (done) => {
        chai.request(server)
            .post('/plant/create')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Body values are incorrect");
                done();
            });
    });

    it('It should returns bad token', function (done) {
        chai.request(server)
            .post('/plant/create')
            .set('api_token', 'Test')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is invalid");
                done();
            });
    });

    var admin_apitoken;
    var base_apitoken;

    before(function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                admin_apitoken = res.body.api_token;
                done();
            });
    });

    before(function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                base_apitoken = res.body.api_token;
                done();
            });
    });
    /*
    it('Should fail without a admin account', function (done) {
        chai.request(server)
        .post('/plant/create')
        .set('api_token', base_apitoken)
        .send(
        {
            "name": "test",
            "scientific_name": "test",
            "max_height": 1,
            "ids_soil_ph": "test",
            "ids_soil_type": "test",
            "ids_sun_exposure": "test",
            "ids_soil_humidity": "test",
            "ids_reproduction": "test",
            "ids_plant_container": "test",
            "planting_period": "test",
            "florering_period": "test",
            "harvest_period": "test",
            "cutting_period": "test",
            "fk_id_frozen_tolerance": 1,
            "fk_id_growth_rate": 1,
            "growth_duration": 1
        })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is invalid");
                done();
            });
    });
    */
    it('Shouldnt create duplicate plant', function (done) {
        chai.request(server)
        .post('/plant/create')
        .set('api_token', admin_apitoken)
        .send({
            "name": "daisy",
            "scientific_name": "bellis perennis",
            "max_height": 1,
            "ids_soil_ph": "test",
            "ids_soil_type": "test",
            "ids_sun_exposure": "test",
            "ids_soil_humidity": "test",
            "ids_reproduction": "test",
            "ids_plant_container": "test",
            "planting_period": "test",
            "florering_period": "test",
            "harvest_period": "test",
            "cutting_period": "test",
            "fk_id_frozen_tolerance": 1,
            "fk_id_growth_rate": 1,
            "growth_duration": 1
        })
        .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('message');
            res.body[0].message.should.equal("Plant already exist");
            done();
        });
    });


    it('Should create a plant in the bdd', (done) => {
        chai.request(server)
        .post('/plant/create')
        .send(
        {
            "name": "test",
            "scientific_name": "test",
            "max_height": 1,
            "ids_soil_ph": "test",
            "ids_soil_type": "test",
            "ids_sun_exposure": "test",
            "ids_soil_humidity": "test",
            "ids_reproduction": "test",
            "ids_plant_container": "test",
            "planting_period": "test",
            "florering_period": "test",
            "harvest_period": "test",
            "cutting_period": "test",
            "fk_id_frozen_tolerance": 1,
            "fk_id_growth_rate": 1,
            "growth_duration": 1
        })
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('message');
            res.body[0].message.should.equal("Plant created");
            done();
        });
    });
});