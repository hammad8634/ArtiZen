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
    // Populate test database with some data
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/v1/product/all', () => {
    it('should return a list of products', async () => {
      const response = await supertest(app).get('/api/v1/product/all');
      console.log(
        `Response of 1st test s: ${response} and status: ${response.status}`
      );
      assert.equal(response.status, 200);
      assert(response.body && typeof response.body === 'object');
    });
  });

  describe('POST /api/v1/product/create', () => {
    it('Will not create Product Due to not logged in', async () => {
      const product = { name: 'Test Product', price: 9.99 };
      const response = await supertest(app)
        .post('/api/v1/product/create')
        .send(product);
      // console.log(
      //   `Response of 2nd test s: ${response} and status: ${response.status}`
      // );
      assert.equal(response.status, 500);
    });
  });
});
