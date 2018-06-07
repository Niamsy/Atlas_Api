var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect();
var supertest = require('supertest');
var api = supertest('http://localhost:3000')

describe('TEST ECLATE', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

// describe('Test api', () => {
//   describe('#getTest', () => {
//     it('shoud return yes if exist and sql launched', (done) => {
//       api.get('/plant/?name=daisy')
//         .set('Accept', 'text/plain')
//         .expect(200)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.text).to.equal('yes');
//           done();
//         })
//     })
//   })
// })
