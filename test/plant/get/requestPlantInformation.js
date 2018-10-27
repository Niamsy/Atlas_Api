process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/GET /plant/request/information', () => {
  let apiToken;
  let requestId;
  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'default')
      .set('password', 'admin')
      .end((err, res) => {
        apiToken = res.body.api_token;

        chai
          .request(server)
          .post('/plant/request/create')
          .set('api_token', apiToken)
          .send({
            sendMail: false,
            name: 'Test /plant/request/information',
            scientific_name: 'Test /plant/request/information',
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
          .end((err, res) => {
            requestId = res.body.request_id;
            done();
          });
      });
  });

  it('It should returns 400: Header values are incorrect.', done => {
    chai
      .request(server)
      .get('/plant/request/information')
      .set('request_id', -1)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('It should returns 200: Success', done => {
    chai
      .request(server)
      .get('/plant/request/information')
      .set('request_id', requestId)
      .set('api_token', apiToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        res.body.should.have.property('result');
        done();
      });
  });
});
