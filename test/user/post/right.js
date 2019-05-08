process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('/POST user/right', () => {
  let apiTokenAdmin;
  let apiTokenNonAdmin;

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        apiTokenAdmin = res.body.api_token;
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
        apiTokenNonAdmin = res.body.api_token;
        done();
      });
  });

  it('it should returns header values are incorrect', done => {
    chai
      .request(server)
      .post('/user/right')
      .send({ email: 'atlas.tozzi@gmail.com' })
      .set('api_token', 'tozzizo')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('it should returns Api token is wrong', done => {
    chai
      .request(server)
      .post('/user/right')
      .send({ email: 'test', right_id: 1 })
      .set('api_token', 'testos')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('it should returns need admin right', done => {
    chai
      .request(server)
      .post('/user/right')
      .send({ email: 'atlas@gmail.com', right_id: 1 })
      .set('api_token', apiTokenNonAdmin)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('You need to be admin.');
        done();
      });
  });

  it('it should returns success', done => {
    chai
      .request(server)
      .post('/user/right')
      .send({ email: 'atlas@gmail.com', right_id: 1 })
      .set('api_token', apiTokenAdmin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });

  it('it should returns success', done => {
    chai
      .request(server)
      .post('/user/right')
      .send({ api_token: apiTokenAdmin, email: 'atlas@gmail.com', right_id: 2 })
      .set('api_token', apiTokenAdmin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });
});
