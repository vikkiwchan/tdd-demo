const { expect } = require('chai');
const { syncAndSeed } = require('../db');
//super test wraps around express, and will actually spin up a server and will get in between our request and responses so we can test our request and responses
const app = require('supertest')(require('../app'));

describe('Routes', () => {
  let seed;
  beforeEach(async () => {
    seed = await syncAndSeed();
  });
  describe('GET /api/employees', () => {
    it('return 3 employees', async () => {
      const response = await app.get('/api/employees');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(3);
    });
  });
  describe('GET/api/departments/:id/employees', () => {
    it('return employees in department', async () => {
      const response = await app.get(
        `/api/departments/${seed.departments.engineering.id}/employees`
      );
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);
    });
    it('returns an empty array if there are none', async () => {
      const response = await app.get(
        `/api/departments/${seed.departments.hr.id}/employees`
      );
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(0);
      expect(response.body).to.eql([]); //use eql to compare objects
    });
  });
  describe('POST/api/departments', () => {
    it('create a department', async () => {
      const response = await app
        .post('/api/departments/')
        .send({ name: 'Finance' });
      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Finance');
    });
    it('fails if no department name', async () => {
      const response = await app.post('/api/departments/');
      expect(response.status).to.equal(500);
    });
  });
});
