process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;

chai.use(chaiHttp);

describe('/POST plant/request', () => {
  let api_token;

  before((done) => {
    chai.request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        api_token = res.body.api_token;
        done();
      });
  });

  it('it should returns bad token API', (done) => {
    chai.request(server)
      .post('/plant/request')
      .send({api_token: "amlksjdmlk", old_password: "admin", new_password: "adminAdmin"})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("API token is invalid or empty");
        done();
      });
  });

  it('it should return wrong password', (done) => {
    chai.request(server)
      .post('/plant/request')
      .send({api_token: api_token, old_password: "12345", new_password: "adminAdmin"})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Wrong password.");
        done();
      });
  });

  it('it should return password need to have at least 8 characters', (done) => {
    chai.request(server)
      .post('/plant/request')
      .send({api_token: api_token, old_password: "12345678", new_password: "1234567"})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Password needs to get more than 8 characters.");
        done();
      });
  });

  it('it should return success', (done) => {
    chai.request(server)
      .post('/plant/request')
      .send({api_token: api_token, old_password: "12345678", new_password: "123456789"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Success");
        done();
      });
  });

  it('it should return success and create the request', (done) => {
    chai.request(server)
      .post('/plant/request')
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
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Success");
        done();
      });
  });

  it('it should return The request already exist and fail', (done) => {
    chai.request(server)
      .post('/plant/request')
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
        res.should.have.status(402);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("A request for this plant already exist");
        done();
      });
  });
});
