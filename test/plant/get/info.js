process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index').app;

chai.use(chaiHttp);

describe('/GET plant/info', () => {
  it('it should returns bad header values', done => {
    chai
      .request(server)
      .get('/plant/info')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Header values are incorrect.');
        done();
      });
  });

  it("it should returns plant doesn't exist", done => {
    chai
      .request(server)
      .get('/plant/info')
      .set('plant_id', 9999)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal("The plant requested doesn't exist");
        done();
      });
  });

  it('it should returns correct values', done => {
    chai
      .request(server)
      .get('/plant/info')
      .set('plant_id', 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.name.should.equal('daisy');
        res.body.scientific_name.should.equal('bellis perennis');
        res.body.maxheight.should.equal(0.3);
        res.body.ids_reproduction.should.equal('00011');
        res.body.ids_soil_type.should.equal('11111');
        res.body.ids_soil_ph.should.equal('111');
        res.body.ids_soil_humidity.should.equal('0011');
        res.body.ids_sun_exposure.should.equal('011');
        res.body.ids_plant_container.should.equal('11');
        res.body.planting_period.should.equal(
          'february, march, april, july, august, september, octember, november'
        );
        res.body.harvest_period.should.equal('march, april, may, june, july, august, september');
        res.body.cutting_period.should.equal('');
        res.body.fk_id_frozen_tolerance.should.equal(3);
        res.body.fk_id_growth_rate.should.equal(3);
        res.body.growth_duration.should.equal(0.6);
        done();
      });
  });
});
