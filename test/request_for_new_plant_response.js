process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST plant/request/response', () => {
    let admin_api_token;
    let default_api_token;

    before((done) => {
        chai.request(server)
        .post('/user/authentication')
        .set('username', 'admin')
        .set('password', 'admin')
        .end((err, res) => {
            admin_api_token = res.body.api_token;
            done();
        });
        chai.request(server)
        .post('/user/authentication')
        .set('username', 'default')
        .set('password', 'default')
        .end((err, res) => {
            default_api_token = res.body.api_token;
            done();
        });

      chai.request(server)
      .post('/plant/request/create')
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
      .end((err, res) => {});
    });

    it('It should return 400: Body values are incorrect', (done) => {
        chai.request(server)
        .post('/plant/request/response')
        .end((err, res) => { 
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Body values are incorrect");
            done();
        });
    });

    it('It should return 401: API token is invalid or empty', (done) => {
        chai.request(server)
        .post('/plant/request/response')
        .send(
          {
              id_request: 1,
              status: true
          })
          .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal("API token is invalid or empty");
              done();
          });
    });

    it('It should return 402: The API Token doesnt belong to a admin', (done) => {
        chai.request(server)
        .post('/plant/request/response')
        .set('api_token', default_api_token)
        .send(
          {
              id_request: 1,
              status: true
          })
          .end((err, res) => {
              res.should.have.status(402);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal("The API Token doesn't belong to an admin");
              done();
          });
    });

    it('It should return 403: No request with the given request_id exist', (done) => {
        chai.request(server)
        .post('/plant/request/response')
        .set('api_token', admin_api_token)
        .send(
          {
              id_request: -1,
              status: true
          })
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal("No request with the given request_id exists");
              done();
          });
    });

    it('It should return 200: Sucess', (done) => {
        chai.request(server)
        .post('/plant/request/response')
        .set('api_token', admin_api_token)
        .send(
          {
              id_request: 1,
              status: true,
              sendMail: false
          })
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal("Success");
              done();
          });
    });
});
