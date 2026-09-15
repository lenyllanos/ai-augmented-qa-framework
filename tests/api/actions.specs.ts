import { test, expect } from '@playwright/test';

test.describe('Actions API - State Machine & Business Rules', () => {

const uniqueSuffix = Date.now();
let createdActionId: string;

const validActionPayload = {
title: Clean up local park #${uniqueSuffix},
description: 'Community cleanup initiative organized by local volunteers.',
category: 'ENV_CLEAN',
min_participants: 5,
max_participants: 15,
scheduled_at: new Date(Date.now() + 86400000).toISOString(),
creator_id: '1',
};

test('POST /actions should create an initiative with status PENDING', async ({ request }) => {
const response = await request.post('/actions', {
data: validActionPayload,
});

// Validate creation response status code
expect(response.status()).toBe(201);

const body = await response.json();

// Persist identifier for subsequent state transition tests
createdActionId = body.action_id || body.id;

// Business rule assertions
expect(body).toHaveProperty('title', validActionPayload.title);
expect(body).toHaveProperty('status', 'pending');
expect(body).toHaveProperty('category', validActionPayload.category);

});

test('PATCH /actions/:id/complete should fail if action is still PENDING', async ({ request }) => {
test.skip(!createdActionId, 'Skipping: Action creation dependency failed');

// Pending action cannot transition directly to completed without prior approval
const response = await request.patch(`/actions/${createdActionId}/complete`, {
  data: { status: 'completed' },
});

// Expect client error or forbidden response from backend
expect([400, 403]).toContain(response.status());

});

test('POST /actions should reject payload with missing mandatory fields', async ({ request }) => {
// Missing scheduled_at, category, and creator_id
const invalidPayload = {
title: 'Incomplete Action',
description: 'Missing fields',
};

const response = await request.post('/actions', {
  data: invalidPayload,
});

// DTO validation must return 400 Bad Request
expect(response.status()).toBe(400);

});

});