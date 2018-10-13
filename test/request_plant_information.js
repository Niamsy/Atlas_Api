process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/GET /plant/request/information', () =>
{
    let api_token;

    before(function (done) {
        chai.request(server)
        .post('/user/authentication')
        .set('username', 'admin')
        .set('password', 'admin')
        .end((err, res) => {
            api_token = res.body.api_token;
            done();
        });
    });

    it('It should returns 400: Body values are incorrect', (done) => {
        chai.request(server)
            .get('/plant/request/information')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Body values are incorrect");
                done();
            });
    });

    it('It should returns 401: API token is invalid or empty', (done) => {
       chai.request(server)
           .get('/plant/request/information')
           .set('request_id', -1)
           .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.a('object');
               res.body.should.have.property('message');
               res.body.message.should.equal("API token is invalid or empty");
               done();
           });
    });

    it('It should returns 500: Sucess', (done) => {
       chai.request(server)
           .get('/plant/request/information')
           .set('request_id', 1)
           .set('api_token', api_token)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               res.body.should.have.property('message');
               res.body.message.should.equal("Sucess");
               res.body.should.have.property('result');
               done();
        });
    });
});