process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST /disconnection', () => {
    it('it should returns Bad parameters', function (done) {
        chai.request(server)
        .post('/disconnection')
        .set('token', "")
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Bad parameters");
            done();
        });
    });

    it('it should returns Bad token', function (done) {
        chai.request(server)
        .post('/disconnection')
        .set('api_token', "test")
        .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Bad token");
            done();
        });
    });

    it('it should returns Disconnection success', function (done) {
        let token = "";
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                token = JSON.stringify(res.body);
                token = res.body['api_token'];
                chai.request(server)
                .post('/disconnection')
                .set('api_token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Disconnection success");
                    done();
                });
            });
    });
});