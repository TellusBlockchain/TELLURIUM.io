const request = require('supertest');
const app = require('../app');
const models = require('../models');

describe('Users routes', function() {
  beforeEach( async () => {
    await models.User.sync({ force: true });
  });

  afterAll( () => {
    models.Transaction.sequelize.close();
  });

  it('response of GET /users should return status=200', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        let users = JSON.parse(res.text);
        
        expect( Array.isArray(users) ).toBe(true);
        expect( users.length ).toBe(0);

        if (err) return done(err);
        done()
      });
  });

  it('response of POST /users should save user from params', async function(done) {
    let users = await models.User.findAll();
    expect( users.length ).toBe(0);

    request(app)
      .post('/users')
      .send({
        email: 'test@mail.net',
        username: '',
        eth_address: '0x274Ac9f9D3720533e74432cDc6B2065f5A79A0AA',
        role: 0
      })
      .expect(200)
      .end(async function(err, res) {
        let users = await models.User.findAll();
        expect( users.length ).toBe(1);
        expect( users[0].email ).toBe('test@mail.net');
        if (err) return done(err);
        done()
      });
  });
});