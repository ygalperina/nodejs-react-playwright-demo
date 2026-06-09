import { test, expect, APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3001';

test.describe('Tasks API', () => {
  let request: APIRequestContext;
  let createdTaskId: number;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: API_URL });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('GET /api/tasks returns an array', async () => {
    const res = await request.get('/api/tasks');
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request.post('/api/tasks', {
      data: { title: 'API Test Task', description: 'Created by API test', status: 'todo' },
    });
    expect(res.status()).toBe(201);
    const task = await res.json();
    expect(task.id).toBeDefined();
    expect(task.title).toBe('API Test Task');
    expect(task.status).toBe('todo');
    createdTaskId = task.id;
  });

  test('POST /api/tasks returns 400 when title is missing', async () => {
    const res = await request.post('/api/tasks', { data: { description: 'no title' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBeDefined();
  });

  test('GET /api/tasks/:id returns the task', async () => {
    const res = await request.get(`/api/tasks/${createdTaskId}`);
    expect(res.status()).toBe(200);
    expect((await res.json()).id).toBe(createdTaskId);
  });

  test('GET /api/tasks/:id returns 404 for unknown id', async () => {
    const res = await request.get('/api/tasks/999999999');
    expect(res.status()).toBe(404);
  });

  test('PUT /api/tasks/:id updates the task status', async () => {
    const res = await request.put(`/api/tasks/${createdTaskId}`, {
      data: { status: 'in_progress' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).status).toBe('in_progress');
  });

  test('GET /api/tasks?status= filters by status', async () => {
    const res = await request.get('/api/tasks?status=in_progress');
    expect(res.status()).toBe(200);
    const tasks: { status: string }[] = await res.json();
    expect(tasks.every((t) => t.status === 'in_progress')).toBe(true);
  });

  test('DELETE /api/tasks/:id removes the task', async () => {
    const deleteRes = await request.delete(`/api/tasks/${createdTaskId}`);
    expect(deleteRes.status()).toBe(204);

    const getRes = await request.get(`/api/tasks/${createdTaskId}`);
    expect(getRes.status()).toBe(404);
  });
});