process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/GET /plant/request/fetch', () => {
  let api_token;

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        api_token = res.body.api_token;
        done();
      });
  });

  it('It should return Token null', done => {
    chai
      .request(server)
      .get('/plant/request/fetch')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('It should return Token invalid', done => {
    chai
      .request(server)
      .get('/plant/request/fetch')
      .set('api_token', 'Test')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('It should return success', done => {
    chai
      .request(server)
      .get('/plant/request/fetch')
      .set('api_token', api_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('requests');
        done();
      });
  });
});