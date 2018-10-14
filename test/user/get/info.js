process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../../index').app;
const should   = chai.should();

chai.use(chaiHttp);

describe('/GET userInfo', () => {
  let api_token;

  before(function (done) {
    chai.request(server)
    .post('/user/authentication')
    .set('username', 'admin')
    .set('password', 'admin')
    .end((err, res) => {
      api_token = res.body.api_token;
      done();
    });
  });

  it('it should returns bad header values', (done) => {
    chai.request(server)
    .get('/user/info')
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("Header values are incorrect.");
      done();
    });
  });

  it('it should returns bad token', (done) => {
    chai.request(server)
    .get('/user/info')
    .set('api_token', "test")
    .set('email', 'atlas_2020@labeip.epitech.eu')
    .end((err, res) => {
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("Api token is wrong.");
      done();
    });
  });

  it('it should return user admin', (done) => {
    chai.request(server)
    .get('/user/info')
    .set('api_token', api_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.should.have.property('email');
      res.body.should.have.property('created_at');
      res.body.should.have.property('last_connection_at');
      res.body.should.have.property('right_id');
      done();
    });
  });
});
