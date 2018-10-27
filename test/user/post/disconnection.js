process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('/POST /user/disconnection', () => {
  it('it should returns Header values are incorrect.', done => {
    chai
      .request(server)
      .post('/user/disconnection')
      .set('token', '')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('it should returns Bad token', done => {
    chai
      .request(server)
      .post('/user/disconnection')
      .set('api_token', 'test')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('it should returns user/disconnection success', done => {
    let token = '';
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        token = JSON.stringify(res.body);
        token = res.body.api_token;
        chai
          .request(server)
          .post('/user/disconnection')
          .set('api_token', token)
          .end((error, result) => {
            result.should.have.status(200);
            result.body.should.be.a('object');
            result.body.should.have.property('message');
            result.body.message.should.equal('Disconnection success');
            done();
          });
      });
  });
});
