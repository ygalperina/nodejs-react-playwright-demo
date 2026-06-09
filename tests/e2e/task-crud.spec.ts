import { test, expect } from '@playwright/test';
import { TasksPage } from './pages/TasksPage';

test.describe('Task CRUD', () => {
  let tasksPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await tasksPage.goto();
  });

  test('page loads with the task form visible', async () => {
    await expect(tasksPage.page).toHaveTitle(/Task Manager/);
    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.addButton).toBeVisible();
  });

  test('creates a new task', async () => {
    const title = `Test Task ${Date.now()}`;
    await tasksPage.addTask(title, 'A test description');

    const card = tasksPage.getTaskByTitle(title);
    await expect(card).toBeVisible();
    await expect(card.getByTestId('task-title')).toHaveText(title);
    await expect(card.getByTestId('task-description')).toHaveText('A test description');
  });

  test('creates a task with only a title', async () => {
    const title = `Simple Task ${Date.now()}`;
    await tasksPage.addTask(title);
    await expect(tasksPage.getTaskByTitle(title)).toBeVisible();
  });

  test('deletes a task', async () => {
    const title = `Task to Delete ${Date.now()}`;
    await tasksPage.addTask(title);
    await expect(tasksPage.getTaskByTitle(title)).toBeVisible();

    await tasksPage.deleteTask(title);
    await expect(tasksPage.getTaskByTitle(title)).not.toBeVisible();
  });

  test('updates task status', async () => {
    const title = `Status Task ${Date.now()}`;
    await tasksPage.addTask(title);

    await tasksPage.setTaskStatus(title, 'in_progress');

    const statusSelect = tasksPage.getTaskByTitle(title).getByTestId('task-status-select');
    await expect(statusSelect).toHaveValue('in_progress');
  });

  test('clears the form after adding a task', async () => {
    await tasksPage.addTask(`Clear Form Task ${Date.now()}`);
    await expect(tasksPage.titleInput).toHaveValue('');
  });
});