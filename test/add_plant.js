process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);

describe('/POST plant/add', () => {
    it('it should returns bad header values', (done) => {
	    chai.request(server)
            .post('/plant/add')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Bad parameters");
		        done();
            });
            }); 

    it('it should returns bad token', function (done) {
        chai.request(server)
            .post('/plant/add')
            .set('api_token', 'Test')
            .set('scientific_name', 'Test')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is wrong");
                done();
            });
    });
    
    it('it should add a plant', function (done) {
        let token = "";
        chai.request(server)
            .post('/user/authentication')
            .set('username', 'admin')
            .set('password', 'admin')
            .end((err, res) => {
                token = JSON.stringify(res.body);
                token = res.body['api_token'];
                chai.request(server)
                .post('/plant/add')
                .set('api_token', token)
                .set('scientific_name', 'bellis perennis')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Success");
                    done();
                });
            });
    
    });
});