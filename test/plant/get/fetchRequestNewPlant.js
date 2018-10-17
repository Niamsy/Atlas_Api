process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/GET /plant/request/fetch', () => {
    let default_api_token;
    let admin_api_token;

  before(done => {
      chai
        .request(server)
        .post('/user/authentication')
        .set('username', 'admin')
        .set('password', 'admin')
        .end((err, res) => {
            admin_api_token = res.body.api_token;
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
            default_api_token = res.body.api_token;
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
        done();
      });
  });

  it('It should return Not a admin', done => {
    chai
      .request(server)
      .get('/plant/request/fetch')
      .set('api_token', default_api_token)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should return success', done => {
    chai
      .request(server)
      .get('/plant/request/fetch')
      .set('api_token', admin_api_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('requests');
        done();
      });
  });
});
