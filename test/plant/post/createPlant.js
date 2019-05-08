process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/Post plant/create', () => {
  let adminApiToken;
  let baseApiToken;

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'default')
      .set('password', 'admin')
      .end((err, res) => {
        baseApiToken = res.body.api_token;
        done();
      });
  });

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

  it('It should returns bad token', done => {
    chai
      .request(server)
      .post('/plant/create')
      .set('api_token', 'Test')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('It should returns bad header values', done => {
    chai
      .request(server)
      .post('/plant/create')
      .set('api_token', adminApiToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Body values are incorrect');
        done();
      });
  });

  it('Should fail without a admin account', done => {
    chai
      .request(server)
      .post('/plant/create')
      .set('api_token', baseApiToken)
      .send({
        name: 'test',
        scientific_name: 'test',
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
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('You need to be admin.');
        done();
      });
  });

  it('Shouldnt create duplicate plant', done => {
    chai
      .request(server)
      .post('/plant/create')
      .set('api_token', adminApiToken)
      .send({
        name: 'daisy',
        scientific_name: 'bellis perennis',
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
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Plant already exist');
        done();
      });
  });

  it('Should create a plant in the bdd', done => {
    chai
      .request(server)
      .post('/plant/create')
      .set('api_token', adminApiToken)
      .send({
        name: 'Testos',
        scientific_name: 'Testos',
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
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Plant created');
        done();
      });
  });
});
