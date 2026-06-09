import { test, expect, APIRequestContext } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:3001';

// ── CRUD ──────────────────────────────────────────────────────────────────────

test.describe('Expenses API — CRUD', () => {
  let request: APIRequestContext;
  let createdId: number;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: API });
  });

  test.afterAll(async () => { await request.dispose(); });

  test('GET /api/expenses returns 200 and an array', async () => {
    const res = await request.get('/api/expenses');
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  test('POST /api/expenses creates an expense', async () => {
    const res = await request.post('/api/expenses', {
      data: { title: 'Lunch', amount: 12.50, category: 'food', date: '2099-01-10' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.title).toBe('Lunch');
    expect(body.amount).toBe(12.50);
    expect(body.category).toBe('food');
    createdId = body.id;
  });

  test('POST /api/expenses returns 400 for missing title', async () => {
    const res = await request.post('/api/expenses', { data: { amount: 10, category: 'food', date: '2099-01-10' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBeDefined();
  });

  test('POST /api/expenses returns 400 for missing amount', async () => {
    const res = await request.post('/api/expenses', { data: { title: 'Test', category: 'food', date: '2099-01-10' } });
    expect(res.status()).toBe(400);
  });

  test('POST /api/expenses returns 400 for non-positive amount', async () => {
    const res = await request.post('/api/expenses', { data: { title: 'Test', amount: -5, category: 'food', date: '2099-01-10' } });
    expect(res.status()).toBe(400);
  });

  test('GET /api/expenses/:id returns the expense', async () => {
    const res = await request.get(`/api/expenses/${createdId}`);
    expect(res.status()).toBe(200);
    expect((await res.json()).id).toBe(createdId);
  });

  test('GET /api/expenses/:id returns 404 for unknown id', async () => {
    expect((await request.get('/api/expenses/999999999')).status()).toBe(404);
  });

  test('PUT /api/expenses/:id updates fields', async () => {
    const res = await request.put(`/api/expenses/${createdId}`, {
      data: { title: 'Dinner', amount: 25.00 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Dinner');
    expect(body.amount).toBe(25.00);
  });

  test('DELETE /api/expenses/:id removes the expense', async () => {
    expect((await request.delete(`/api/expenses/${createdId}`)).status()).toBe(204);
    expect((await request.get(`/api/expenses/${createdId}`)).status()).toBe(404);
  });
});

// ── FILTERING ────────────────────────────────────────────────────────────────

test.describe('Expenses API — Filtering', () => {
  let request: APIRequestContext;
  let foodId: number;
  let transportId: number;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: API });
    foodId      = ((await (await request.post('/api/expenses', { data: { title: 'Groceries', amount: 60, category: 'food',      date: '2099-03-05' } })).json())).id;
    transportId = ((await (await request.post('/api/expenses', { data: { title: 'Bus pass',  amount: 40, category: 'transport', date: '2099-04-20' } })).json())).id;
  });

  test.afterAll(async () => {
    await request.delete(`/api/expenses/${foodId}`);
    await request.delete(`/api/expenses/${transportId}`);
    await request.dispose();
  });

  test('GET ?category=food returns only food expenses', async () => {
    const res  = await request.get('/api/expenses?category=food');
    expect(res.status()).toBe(200);
    const rows: { category: string }[] = await res.json();
    expect(rows.every((r) => r.category === 'food')).toBe(true);
  });

  test('GET ?category=transport returns only transport expenses', async () => {
    const rows: { category: string }[] = await (await request.get('/api/expenses?category=transport')).json();
    expect(rows.every((r) => r.category === 'transport')).toBe(true);
  });

  test('GET ?from=&to= returns only expenses in the date range', async () => {
    const res  = await request.get('/api/expenses?from=2099-03-01&to=2099-03-31');
    expect(res.status()).toBe(200);
    const rows: { date: string; id: number }[] = await res.json();
    const ids = rows.map((r) => r.id);
    expect(ids).toContain(foodId);
    expect(ids).not.toContain(transportId);
  });

  test('GET with combined category + date filter narrows results', async () => {
    const res  = await request.get('/api/expenses?category=food&from=2099-03-01&to=2099-03-31');
    const rows: { id: number }[] = await res.json();
    expect(rows.map((r) => r.id)).toContain(foodId);
    expect(rows.map((r) => r.id)).not.toContain(transportId);
  });
});

// ── SUMMARY / TOTALS ─────────────────────────────────────────────────────────

test.describe('Expenses API — Summary', () => {
  let request: APIRequestContext;
  let id1: number;
  let id2: number;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: API });
    // Remove any orphaned rows from previous interrupted runs in our isolated date range
    const stale: { id: number }[] = await (await request.get('/api/expenses?from=2099-06-01&to=2099-06-30')).json();
    for (const e of stale) await request.delete(`/api/expenses/${e.id}`);
    id1 = ((await (await request.post('/api/expenses', { data: { title: 'Food A',   amount: 50, category: 'food',   date: '2099-06-10' } })).json())).id;
    id2 = ((await (await request.post('/api/expenses', { data: { title: 'Health A', amount: 30, category: 'health', date: '2099-06-15' } })).json())).id;
  });

  test.afterAll(async () => {
    await request.delete(`/api/expenses/${id1}`);
    await request.delete(`/api/expenses/${id2}`);
    await request.dispose();
  });

  test('GET /api/expenses/summary returns correct structure', async () => {
    const res  = await request.get('/api/expenses/summary');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.total).toBe('number');
    expect(typeof body.count).toBe('number');
    expect(typeof body.by_category).toBe('object');
  });

  test('GET /api/expenses/summary with date range returns correct totals', async () => {
    const res  = await request.get('/api/expenses/summary?from=2099-06-01&to=2099-06-30');
    const body = await res.json();
    expect(body.total).toBe(80);
    expect(body.count).toBe(2);
    expect(body.by_category.food.total).toBe(50);
    expect(body.by_category.health.total).toBe(30);
  });

  test('GET /api/expenses/summary?category= returns single-category total', async () => {
    const res  = await request.get('/api/expenses/summary?category=food&from=2099-06-01&to=2099-06-30');
    const body = await res.json();
    expect(body.total).toBe(50);
    expect(body.by_category.food.total).toBe(50);
    expect(body.by_category.health).toBeUndefined();
  });
});