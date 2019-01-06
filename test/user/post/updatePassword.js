process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const SHA256 = require('crypto-js/sha256');
const { con, app: server } = require('../../../index');

chai.use(chaiHttp);

describe('/POST updatePassword', () => {
  let apiToken;

  before(done => {
    chai
      .request(server)
      .post('/user/authentication')
      .set('username', 'default')
      .set('password', 'admin')
      .end(async (err, res) => {
        apiToken = res.body.api_token;
        const mdp = SHA256('12345678');
        await con.query(`UPDATE users SET password='${mdp}' WHERE name='default'`);
        done();
      });
  });

  it('it should returns header values are incorrect', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it('it should returns bad token API', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .send({ old_password: 'admin', new_password: 'adminAdmin' })
      .set('api_token', 'amlksjdmlk')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Api token is wrong.');
        done();
      });
  });

  it('it should return wrong password', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .send({ old_password: '12345', new_password: 'adminAdmin' })
      .set('api_token', apiToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Wrong password.');
        done();
      });
  });

  it('it should return password need to have at least 8 characters', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .send({ old_password: '12345678', new_password: '1234567' })
      .set('api_token', apiToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Password needs to get more than 8 characters.');
        done();
      });
  });

  it('it should return success', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .send({ old_password: '12345678', new_password: '123456789' })
      .set('api_token', apiToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });

  it('it should return success and reset the password', done => {
    chai
      .request(server)
      .post('/user/updatePassword')
      .send({ old_password: '123456789', new_password: '12345678' })
      .set('api_token', apiToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });

  after(async () => {
    const mdp = SHA256('admin');
    await con.query(`UPDATE users SET password='${mdp}' WHERE name='default'`);
  });
});
