process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index').app;

chai.use(chaiHttp);

describe('/POST plant/add', () => {
  it('it should returns bad header values', (done) => {
    chai.request(server)
      .post('/plant/add')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Header values are incorrect.");
        done();
      });
  });

  it('it should returns bad token', function (done) {
    chai.request(server)
      .post('/plant/add')
      .set('api_token', 'Test')
      .send({scientific_name: 'Test'})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("Api token is wrong.");
        done();
      });
  });
});