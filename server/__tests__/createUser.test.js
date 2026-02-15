const path = require('path');
const request = require('supertest');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const loadApp = () => {
  jest.resetModules();
  return require('../app');
};

describe('POST /api/users', () => {
  it('creates a user when all fields provided (happy path)', async () => {
    const app = loadApp();

    const payload = { id: 'u1', name: 'Charlie', room: 'NewRoom' };

    const response = await request(app).post('/api/users').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe('charlie');
    expect(response.body.user.room).toBe('newroom');
  });

  it('returns 400 when required fields missing (sad path)', async () => {
    const app = loadApp();

    const payload = { id: 'u2', name: 'NoRoom' };

    const response = await request(app).post('/api/users').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('id, name and room are required.');
  });
});
