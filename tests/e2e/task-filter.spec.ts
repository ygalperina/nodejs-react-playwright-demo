import { test, expect } from '@playwright/test';
import { TasksPage } from './pages/TasksPage';

test.describe('Task Filtering', () => {
  let tasksPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto();
  });

  test('filters to show only done tasks', async () => {
    const suffix = Date.now();
    const todoTitle = `Todo Task ${suffix}`;
    const doneTitle = `Done Task ${suffix}`;

    await tasksPage.addTask(todoTitle);
    await tasksPage.addTask(doneTitle);
    await tasksPage.setTaskStatus(doneTitle, 'done');

    await tasksPage.filterByStatus('done');

    await expect(tasksPage.getTaskByTitle(doneTitle)).toBeVisible();
    await expect(tasksPage.getTaskByTitle(todoTitle)).not.toBeVisible();
  });

  test('filters to show only todo tasks', async () => {
    const suffix = Date.now();
    const todoTitle = `Todo Task ${suffix}`;
    const inProgressTitle = `In Progress Task ${suffix}`;

    await tasksPage.addTask(todoTitle);
    await tasksPage.addTask(inProgressTitle);
    await tasksPage.setTaskStatus(inProgressTitle, 'in_progress');

    await tasksPage.filterByStatus('todo');

    await expect(tasksPage.getTaskByTitle(todoTitle)).toBeVisible();
    await expect(tasksPage.getTaskByTitle(inProgressTitle)).not.toBeVisible();
  });

  test('shows all tasks when All filter is selected', async () => {
    const suffix = Date.now();
    const t1 = `Task A ${suffix}`;
    const t2 = `Task B ${suffix}`;

    await tasksPage.addTask(t1);
    await tasksPage.addTask(t2);
    await tasksPage.setTaskStatus(t2, 'in_progress');

    await tasksPage.filterByStatus('in_progress');
    await tasksPage.filterByStatus('all');

    await expect(tasksPage.getTaskByTitle(t1)).toBeVisible();
    await expect(tasksPage.getTaskByTitle(t2)).toBeVisible();
  });
});