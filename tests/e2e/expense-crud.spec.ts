import { test, expect } from '@playwright/test';
import { ExpensesPage } from './pages/ExpensesPage';

test.describe('Expense CRUD', () => {
  let ep: ExpensesPage;

  test.beforeEach(async ({ page }) => {
    ep = new ExpensesPage(page);
    await ep.goto();
  });

  test('expenses page loads with the add form visible', async () => {
    await expect(ep.amountInput).toBeVisible();
    await expect(ep.titleInput).toBeVisible();
    await expect(ep.addButton).toBeVisible();
  });

  test('adds an expense with all fields', async () => {
    const title = `Lunch ${Date.now()}`;
    await ep.addExpense({ amount: 14.50, title, category: 'food', notes: 'work lunch' });

    const card = ep.getExpenseByTitle(title);
    await expect(card.getByTestId('expense-amount')).toHaveText('$14.50');
    await expect(card.getByTestId('expense-category')).toHaveText('food');
    await expect(card.getByTestId('expense-notes')).toHaveText('work lunch');
  });

  test('adds an expense with required fields only', async () => {
    const title = `Bus fare ${Date.now()}`;
    await ep.addExpense({ amount: 3, title, category: 'transport' });
    await expect(ep.getExpenseByTitle(title)).toBeVisible();
  });

  test('deletes an expense', async () => {
    const title = `Delete me ${Date.now()}`;
    await ep.addExpense({ amount: 5, title });
    await ep.deleteExpense(title);
    await expect(ep.getExpenseByTitle(title)).not.toBeVisible();
  });

  test('form resets after adding an expense', async () => {
    await ep.addExpense({ amount: 10, title: `Reset test ${Date.now()}` });
    await expect(ep.amountInput).toHaveValue('');
    await expect(ep.titleInput).toHaveValue('');
  });
});