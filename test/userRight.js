process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST user/right', () => {
    let api_token_admin;
    let api_token_non_admin;

    before(function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin2010')
            .end((err, res) => {
                api_token_admin = res.body.api_token;
                done();
            });
    });

    before(function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'tozzizo')
            .set('password', '12345678')
            .end((err, res) => {
                api_token_non_admin = res.body.api_token;
                done();
            });
    });

    it('it should returns header values are incorrect', (done) => {
        chai.request(server)
        .post('/user/right')
        .send({api_token: "tozzizo", email: "taba@email.com"})
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Header values are incorrect");
            done();
        });
    });

    it('it should returns Api token is wrong', (done) => {
        chai.request(server)
        .post('/user/right')
        .send({api_token: "testos", email: "test", right_id: 1})
        .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Api token is wrong");
            done();
        });
    });

    it('it should returns need admin right', (done) => {
        chai.request(server)
        .post('/user/right')
        .send({api_token: api_token_non_admin, email: "taba@email.com", right_id: 1})
        .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("You need to be admin to modify right id");
            done();
        });
    });

    it('it should returns success', (done) => {
        chai.request(server)
        .post('/user/right')
        .send({api_token: api_token_admin, email: "taba@email.com", right_id: 1})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Success");
            done();
        });
    });

    it('it should returns success', (done) => {
        chai.request(server)
        .post('/user/right')
        .send({api_token: api_token_admin, email: "taba@email.com", right_id: 2})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal("Success");
            done();
        });
    });
});
