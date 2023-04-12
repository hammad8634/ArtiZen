const assert = require('assert');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('API Tests', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /api/v1/buyer/login', () => {
    it('Buyer Login Form', async () => {
      const user = { user: 'hammadbuyer1@gmail.com', password: 'haxer421' };
      const response = await supertest(app)
        .post('/api/v1/buyer/login')
        .send(user);
      // console.log(
      //   `Response of 1st test: ${JSON.stringify(response.body)} and status: ${
      //     response.status
      //   }`
      // );
      assert.equal(response.status, 201);
      assert.property(response.body, 'token');
    });
  });

  describe('POST /api/v1/admin/create', () => {
    it('Admin SignUp Form (Should not create other admin, because first admin is not login.', async () => {
      const user = {
        name: 'Hammad Mukhtar',
        email: 'hammadAdmin2@gmail.com',
        password: 'admin321',
        passwordConfirm: 'admin321',
      };
      const response = await supertest(app).post('/api/v1/admin/create');
      //   .send(user);
      // console.log(
      //   `Response of 2nd test: ${JSON.stringify(response.body)} and status: ${
      //     response.status
      //   }`
      // );
      assert.equal(response.status, 200);
    });
  });
});
