import { test, expect } from '@playwright/test';

// Cambia el puerto si tu backend corre en otro (ej: 3000, 4000, 8000)
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('Users API - Security & Registration Contracts', () => {

  const uniqueSuffix = Date.now();
  const testUser = {
    email: `qa_engineer_${uniqueSuffix}@example.com`,
    password: 'SuperSecretPassword123!'
  };

  test('POST /users should register a user and NEVER expose password_hash', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/users`, {
      data: testUser,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body).toHaveProperty('email', testUser.email);
    expect(body).toHaveProperty('role', 'USER');
    expect(body).toHaveProperty('account_status', 'ACTIVE');

    expect(body).not.toHaveProperty('password_hash');
    expect(body).not.toHaveProperty('password');
  });

  test('POST /users should reject duplicate email registration', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/users`, {
      data: testUser,
    });

    expect([400, 409]).toContain(response.status());
  });

});