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

  describe('GET /api/v1/store/all', () => {
    it('should return all products', async () => {
      const response = await supertest(app).get('/api/v1/store/all');
      console.log(
        `Response of 1st test: ${JSON.stringify(response.body)} and status: ${
          response.status
        }`
      );
      assert.equal(response.status, 200);
      assert(response.body && typeof response.body === 'object');
    });
  });

  describe('GET /api/v1/review/', () => {
    it('should return all reviews', async () => {
      const response = await supertest(app).get('/api/v1/review/');
      console.log(
        `Response of 1st test: ${JSON.stringify(response.body)} and status: ${
          response.status
        }`
      );
      assert.equal(response.status, 200);
      assert(response.body && typeof response.body === 'object');
    });
  });
});
