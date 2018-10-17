process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;
const should = chai.should();
const con = require('../../../index').con;
const SHA256 = require('crypto-js/sha256');

chai.use(chaiHttp);

describe('/POST resetPassword', () => {
  it('it should returns bad body value', done => {
    chai
      .request(server)
      .post('/user/resetPassword')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Body values are incorrect.');
        done();
      });
  });

  it('it should returns toto@gmail.com is linked to nobody', done => {
    chai
      .request(server)
      .post('/user/resetPassword')
      .send({ email: 'toto@gmail.com' })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('toto@gmail.com is linked to nobody');
        done();
      });
  });

  it('it should returns success', done => {
    chai
      .request(server)
      .post('/user/resetPassword')
      .send({ email: 'atlas.tozzi@gmail.com' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });

  after(async () => {
    const adminReset = SHA256('admin');
    await con.query(
      `UPDATE users SET password='${adminReset}' WHERE email='atlas_2020@labeip.epitech.eu'`
    );
  });
});
