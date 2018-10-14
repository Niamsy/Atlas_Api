process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST user/registration', () => {
  it('it should returns success', done => {
    chai
      .request(server)
      .post('/user/registration')
      .send({ username: 'tozzizo', email: 'atlas.tozzi@gmail.com', password: '12345678' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Success');
        done();
      });
  });

  it('it should returns bad body values', done => {
    chai
      .request(server)
      .post('/user/registration')
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Need all values in body. (email, username and password).');
        done();
      });
  });

  it('it should returns password error', done => {
    chai
      .request(server)
      .post('/user/registration')
      .send({ username: 'tozziz', email: 'tabe@email.com', password: '1234567' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Password need to get more than 8 characters.');
        done();
      });
  });

  it('it should returns already in use', done => {
    chai
      .request(server)
      .post('/user/registration')
      .send({ username: 'admin', email: 'tabe@email.com', password: '1234567' })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Already in use!');
        done();
      });
  });
});
