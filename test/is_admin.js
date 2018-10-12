process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../index').app;
const should   = chai.should();

chai.use(chaiHttp);

describe('/GET isAdmin', () => {
    let api_token;

    before((done) => {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                api_token = res.body.api_token;
                done();
            });
    });

    it('it should returns bad header values', (done) => {
        chai.request(server)
            .get('/user/isAdmin')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Header values are incorrect.");
                done();
            });
    });

    it('it should returns bad token', (done) => {
        chai.request(server)
            .get('/user/isAdmin')
            .set('api_token', "test")
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is wrong.");
                done();
            });
    });

    it('it should return is admin true', (done) => {
       chai.request(server)
           .get('/user/isAdmin')
           .set('api_token', api_token)
           .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('isAdmin');
                res.body.isAdmin.should.equal(true);
                done();
           });
    });
});