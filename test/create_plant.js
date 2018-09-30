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
                admin_apitoken = res.body.api_token;
                done();
            });
    });

    it('Shouldnt create duplicate plant', function (done) {
        chai.request(server)
            .post('/plant/create')
            .set('api_token', admin_apitoken)
            .set('name', 'daisy')
            .set('scientific_name', 'test')
            .set('maxheight', 'test')
            .set('ids_soil_ph', 'test')
            .set('ids_soil_type', 'test')
            .set('ids_sun_exposure', 'test')
            .set('ids_soil_humidity', 'test')
            .set('ids_reproduction', 'test')
            .set('ids_plant_container', 'test')
            .set('planting_period', 'test')
            .set('florering_period', 'test')
            .set('harvest_period', 'test')
            .set('cutting_period', 'test')
            .set('fk_id_frozen_tolerance', 'test')
            .set('fk_id_growth_rate', 'test')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('message');
                res.body[0].message.should.equal("Plant already exist");
                done();
            });
    });

});