process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/GET role', () => {
  it('it should returns bad header values', done => {
    chai
      .request(server)
      .get('/role')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it("it should returns role doesn't exist", done => {
    chai
      .request(server)
      .get('/role')
      .set('role_id', 9999)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("The role requested doesn't exist");
        done();
      });
  });

  it('it should returns correct values', done => {
    chai
      .request(server)
      .get('/role')
      .set('role_id', 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('string');
        res.body.should.equal('admin');
        done();
      });
  });
});
