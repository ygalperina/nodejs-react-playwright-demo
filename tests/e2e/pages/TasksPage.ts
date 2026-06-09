import { Page, Locator } from '@playwright/test';

export class TasksPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly addButton: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId('task-title-input');
    this.descriptionInput = page.getByTestId('task-description-input');
    this.addButton = page.getByTestId('add-task-button');
    this.taskList = page.getByTestId('task-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(title: string, description?: string) {
    await this.titleInput.fill(title);
    if (description) await this.descriptionInput.fill(description);
    await this.addButton.click();
  }

  async filterByStatus(status: 'all' | 'todo' | 'in_progress' | 'done') {
    await this.page.getByTestId(`filter-${status}`).click();
  }

  getTaskCards() {
    return this.taskList.getByTestId('task-card');
  }

  getTaskByTitle(title: string) {
    return this.taskList.getByTestId('task-card').filter({ hasText: title });
  }

  async deleteTask(title: string) {
    await this.getTaskByTitle(title).getByTestId('delete-task-button').click();
  }

  async setTaskStatus(title: string, status: 'todo' | 'in_progress' | 'done') {
    await this.getTaskByTitle(title).getByTestId('task-status-select').selectOption(status);
  }
}