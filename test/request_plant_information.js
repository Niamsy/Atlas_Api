process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/GET /plant/request/information', () =>
{
    let api_token;
    let request_id;
    before(function (done) {
        chai.request(server)
        .post('/user/authentication')
        .set('username', 'admin')
        .set('password', 'admin')
        .end((err, res) => {
            api_token = res.body.api_token;

            chai.request(server)
            .post('/plant/request/create')
            .set('api_token', api_token)
            .send(
            {
                "name": "Test /plant/request/information",
                "scientific_name": "Test /plant/request/information",
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
                request_id = res.body.request_id;
                done();
            });
        });
    });

    it('It should returns 400: Body values are incorrect', (done) => {
        chai.request(server)
            .get('/plant/request/information')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Header values are incorrect");
                done();
            });
    });

    it('It should returns 401: API token is invalid or empty', (done) => {
       chai.request(server)
           .get('/plant/request/information')
           .set('request_id', -1)
           .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.a('object');
               res.body.should.have.property('message');
               res.body.message.should.equal("API token is invalid or empty");
               done();
           });
    });

    it('It should returns 500: Sucess', (done) => {
       chai.request(server)
           .get('/plant/request/information')
           .set('request_id', request_id)
           .set('api_token', api_token)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               res.body.should.have.property('message');
               res.body.message.should.equal("Sucess");
               res.body.should.have.property('result');
               done();
        });
    });
});