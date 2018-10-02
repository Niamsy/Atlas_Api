process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/GET userPlants', () => {

    it('it should returns bad header values', (done) => {
        chai.request(server)
            .get('/userPlants')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Header values are incorrect");
                done();
            });
    });

    it('it should returns bad token', function (done) {
        chai.request(server)
            .get('/userPlants')
            .set('api_token', 'Test')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is wrong");
                done();
            });
    });

    var api_token;

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

    it('it should returns a json with correct values', function (done) {
        chai.request(server)
            .get('/userPlants')
            .set('api_token', api_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].id.should.equal(1);
                res.body[0].scanned_at.should.equal("2018-03-12T16:50:52.000Z");
                done();
            });
    });

});