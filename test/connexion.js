process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/POST /user/authentication', () => {
    it('it should returns bad header values', (done) => {
	    chai.request(server)
            .post('/user/authentication')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Header values are incorrect");
		        done();
            });
    }); 

    it('it should returns bad authentication', function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'Test')
            .set('password', 'Test')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Bad Authentication");
                done();
            });
    });

    it('it should returns good authentication', function (done) {
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('api_token');
                //res.body.message.should.equal("Bad Authentication");
                done();
            });
    });
});