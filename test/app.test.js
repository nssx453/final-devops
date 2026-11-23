const request = require('supertest');
const app = require('../src/app');

describe('DevOps Final Project API', () => {
  test('GET / returns project title', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('DevOps Final Project');
  });

  test('GET /health returns ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /metrics returns Prometheus metrics', async () => {
    await request(app).get('/');
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain('http_requests_total');
    expect(response.text).toContain('process_cpu');
  });
});