process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST updatePassword', () => {
  let api_token;

  before((done) => {
    chai.request(server)
    .post('/user/authentication')
    .set('username', 'tozzizo')
    .set('password', '12345678')
    .end((err, res) => {
        api_token = res.body.api_token;
        done();
    });
  });

  it('it should returns header values are incorrect', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("Header values are incorrect");
      done();
    });
  });

  it('it should returns bad token API', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .send({api_token: "amlksjdmlk", old_password: "admin", new_password: "adminAdmin"})
    .end((err, res) => {
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("Api token is wrong");
      done();
    });
  });

  it('it should return wrong password', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .send({api_token: api_token, old_password: "12345", new_password: "adminAdmin"})
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("wrong password");
      done();
    });
  });

  it('it should return password need to have at least 8 characters', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .send({api_token: api_token, old_password: "12345678", new_password: "1234567"})
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("password need to have at least 8 characters");
      done();
    });
  });

  it('it should return success', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .send({api_token: api_token, old_password: "12345678", new_password: "123456789"})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("success");
      done();
    });
  });

  it('it should return success and reset the password', (done) => {
    chai.request(server)
    .post('/user/updatePassword')
    .send({api_token: api_token, old_password: "123456789", new_password: "12345678"})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal("success");
      done();
    });
  });
});
