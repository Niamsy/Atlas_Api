process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/POST plant/request/response', () => {
  let adminApiToken;
  let defaultApiToken;
  let requestId;

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        adminApiToken = res.body.api_token;
        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'default')
      .set('password', 'admin')
      .end((err, res) => {
        defaultApiToken = res.body.api_token;
        chai
          .request(server)
          .post('/plant/request/create')
          .set('api_token', defaultApiToken)
          .send({
            sendMail: false,
            name: 'test 1',
            scientific_name: 'test 1',
            max_height: 1,
            ids_soil_ph: 'test',
            ids_soil_type: 'test',
            ids_sun_exposure: 'test',
            ids_soil_humidity: 'test',
            ids_reproduction: 'test',
            ids_plant_container: 'test',
            planting_period: 'test',
            florering_period: 'test',
            harvest_period: 'test',
            cutting_period: 'test',
            fk_id_frozen_tolerance: 1,
            fk_id_growth_rate: 1,
            growth_duration: 1
          })
          .end((error, result) => {
            requestId = result.body.request_id;
            done();
          });
      });
  });

  it('It should return 400: Header values are incorrect.', done => {
    chai
      .request(server)
      .post('/plant/request/response')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('It should return 401: The API Token doesnt belong to a admin', done => {
    chai
      .request(server)
      .post('/plant/request/response')
      .set('api_token', defaultApiToken)
      .send({
        id_request: 1,
        status: true
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('You need to be admin.');
        done();
      });
  });

  it('It should return 403: No request with the given request_id exist', done => {
    chai
      .request(server)
      .post('/plant/request/response')
      .set('api_token', adminApiToken)
      .send({
        id_request: -1,
        status: true,
        sendMail: false
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('No request with the given request_id exists');
        done();
      });
  });

  it('It should return 200: Success', done => {
    chai
      .request(server)
      .post('/plant/request/response')
      .set('api_token', adminApiToken)
      .send({
        id_request: requestId,
        status: true,
        sendMail: false
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });
});
