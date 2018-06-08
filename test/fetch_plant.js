process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET plants/fetch', () => {
    it('it should returns bad header values', (done) => {
	    chai.request(server)
            .get('/plants/fetch')
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
            .get('/plants/fetch')
            .set('api_token', 'Test')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal("Api token is wrong");
                done();
            });
    });
});
