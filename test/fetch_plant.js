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
		done();
            });
    });
});
