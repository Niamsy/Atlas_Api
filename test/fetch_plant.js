process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').app;
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
                res.body.message.should.equal("Header values are incorrect.");
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
                res.body.message.should.equal("Api token is wrong.");
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
            .get('/plants/fetch')
            .set('api_token', api_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0]['name'].should.equal("daisy");
                res.body[0]['scientific_name'].should.equal("bellis perennis");
                res.body[0]['maxheight'].should.equal(0.3);
                res.body[0]['ids_reproduction'].should.equal("00011");
                res.body[0]['ids_soil_type'].should.equal("11111");
                res.body[0]['ids_soil_ph'].should.equal("111");
                res.body[0]['ids_soil_humidity'].should.equal("0011");
                res.body[0]['ids_sun_exposure'].should.equal("011");
                res.body[0]['ids_plant_container'].should.equal("11");
                res.body[0]['planting_period'].should.equal("february, march, april, july, august, september, octember, november");
                res.body[0]['harvest_period'].should.equal("march, april, may, june, july, august, september");
                res.body[0]['cutting_period'].should.equal("");
                res.body[0]['fk_id_frozen_tolerance'].should.equal(3);
                res.body[0]['fk_id_growth_rate'].should.equal(3);
                res.body[0]['scanned_at'].should.equal("2018-03-12T16:50:52.000Z");
                res.body[0]['growth_duration'].should.equal(0.6);
                done();
            });
    });
});
