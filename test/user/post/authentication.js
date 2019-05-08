process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('/POST /user/authentication', () => {
  it('it should returns bad header values', done => {
    chai
      .request(server)
      .post('/user/authentication')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('it should returns bad authentication', done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'Test')
      .set('password', 'Test')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad authentication');
        done();
      });
  });

  it('it should returns good authentication', done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'admin')
      .set('password', 'admin')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('api_token');
        // res.body.message.should.equal("Bad Authentication");
        done();
      });
  });
});
