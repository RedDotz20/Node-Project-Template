import request from 'supertest';
import { app } from '../src/app';

describe('Server Status', () => {
  it('should respond with "Hello World!" message for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello World!');
  });

  // Add more test cases as needed
});
