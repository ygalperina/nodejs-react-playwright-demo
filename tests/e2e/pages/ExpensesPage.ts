import { Page, Locator } from '@playwright/test';

export class ExpensesPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly titleInput: Locator;
  readonly categorySelect: Locator;
  readonly dateInput: Locator;
  readonly notesInput: Locator;
  readonly addButton: Locator;
  readonly expenseList: Locator;

  constructor(page: Page) {
    this.page          = page;
    this.amountInput   = page.getByTestId('expense-amount-input');
    this.titleInput    = page.getByTestId('expense-title-input');
    this.categorySelect = page.getByTestId('expense-category-select');
    this.dateInput     = page.getByTestId('expense-date-input');
    this.notesInput    = page.getByTestId('expense-notes-input');
    this.addButton     = page.getByTestId('add-expense-button');
    this.expenseList   = page.getByTestId('expense-list');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByTestId('nav-expenses').click();
  }

  async addExpense(params: { amount: number; title: string; category?: string; date?: string; notes?: string }) {
    await this.amountInput.fill(String(params.amount));
    await this.titleInput.fill(params.title);
    if (params.category) await this.categorySelect.selectOption(params.category);
    if (params.date)     await this.dateInput.fill(params.date);
    if (params.notes)    await this.notesInput.fill(params.notes);
    await this.addButton.click();
    await this.getExpenseByTitle(params.title).waitFor({ state: 'visible' });
  }

  getExpenseCards() {
    return this.expenseList.getByTestId('expense-card');
  }

  getExpenseByTitle(title: string) {
    return this.expenseList.getByTestId('expense-card').filter({ hasText: title });
  }

  async deleteExpense(title: string) {
    await this.getExpenseByTitle(title).getByTestId('delete-expense-button').click();
  }

  async filterByCategory(category: string) {
    await this.page.getByTestId(`category-filter-${category}`).click();
  }

  async setDateFrom(date: string) {
    await this.page.getByTestId('date-from-input').fill(date);
  }

  async setDateTo(date: string) {
    await this.page.getByTestId('date-to-input').fill(date);
  }

  async clearDateFilter() {
    await this.page.getByTestId('clear-date-filter').click();
  }

  getSummaryTotal() {
    return this.page.getByTestId('summary-total');
  }

  getSummaryCategoryAmount(category: string) {
    return this.page.getByTestId(`summary-category-${category}`);
  }
}