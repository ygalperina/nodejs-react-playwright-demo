import { test, expect } from '@playwright/test';
import { ExpensesPage } from './pages/ExpensesPage';

const API = process.env.API_URL || 'http://localhost:3001';

// Wipe all 2099 test data before the suite so accumulated rows from previous
// interrupted runs don't skew totals-based assertions.
test.beforeAll(async ({ playwright }) => {
  const req = await playwright.request.newContext({ baseURL: API });
  const expenses: { id: number }[] = await (await req.get('/api/expenses?from=2099-01-01&to=2099-12-31')).json();
  for (const e of expenses) await req.delete(`/api/expenses/${e.id}`);
  await req.dispose();
});

// All tests use far-future dates (2099) to stay isolated from real data.

test.describe('Expense Totals & Summary', () => {
  let ep: ExpensesPage;

  test.beforeEach(async ({ page }) => {
    ep = new ExpensesPage(page);
    await ep.goto();
    // Scope to the 2099 date range so tests see only their own data
    await ep.setDateFrom('2099-01-01');
    await ep.setDateTo('2099-12-31');
  });

  test('summary total reflects all visible expenses', async () => {
    const t1 = `Total A ${Date.now()}`;
    const t2 = `Total B ${Date.now()}`;
    await ep.addExpense({ amount: 40, title: t1, date: '2099-06-01' });
    await ep.addExpense({ amount: 60, title: t2, date: '2099-06-02' });

    await expect(ep.getSummaryTotal()).toHaveText('$100.00');
  });

  test('summary shows per-category breakdown', async () => {
    const foodTitle  = `Cat food ${Date.now()}`;
    const transTitle = `Cat trans ${Date.now()}`;
    await ep.addExpense({ amount: 25, title: foodTitle,  category: 'food',      date: '2099-07-01' });
    await ep.addExpense({ amount: 15, title: transTitle, category: 'transport', date: '2099-07-02' });

    // Narrow to July only so this test's data is isolated from the totals test above
    await ep.setDateFrom('2099-07-01');
    await ep.setDateTo('2099-07-31');

    await expect(ep.getSummaryCategoryAmount('food')).toHaveText('$25.00');
    await expect(ep.getSummaryCategoryAmount('transport')).toHaveText('$15.00');
  });
});

test.describe('Expense Category Filtering', () => {
  let ep: ExpensesPage;

  test.beforeEach(async ({ page }) => {
    ep = new ExpensesPage(page);
    await ep.goto();
    await ep.setDateFrom('2099-01-01');
    await ep.setDateTo('2099-12-31');
  });

  test('category filter shows only matching expenses', async () => {
    const foodTitle   = `Filter food ${Date.now()}`;
    const healthTitle = `Filter health ${Date.now()}`;
    await ep.addExpense({ amount: 20, title: foodTitle,   category: 'food',   date: '2099-08-01' });
    await ep.addExpense({ amount: 35, title: healthTitle, category: 'health', date: '2099-08-02' });

    await ep.filterByCategory('food');
    await expect(ep.getExpenseByTitle(foodTitle)).toBeVisible();
    await expect(ep.getExpenseByTitle(healthTitle)).not.toBeVisible();
  });

  test('"All" category filter restores full list', async () => {
    const t1 = `All A ${Date.now()}`;
    const t2 = `All B ${Date.now()}`;
    await ep.addExpense({ amount: 10, title: t1, category: 'housing',       date: '2099-09-01' });
    await ep.addExpense({ amount: 10, title: t2, category: 'entertainment', date: '2099-09-02' });

    await ep.filterByCategory('housing');
    await ep.filterByCategory('all');
    await expect(ep.getExpenseByTitle(t1)).toBeVisible();
    await expect(ep.getExpenseByTitle(t2)).toBeVisible();
  });
});

test.describe('Expense Date Filtering', () => {
  let ep: ExpensesPage;

  test.beforeEach(async ({ page }) => {
    ep = new ExpensesPage(page);
    await ep.goto();
  });

  test('date range shows only expenses within the range', async () => {
    const janTitle = `Jan exp ${Date.now()}`;
    const decTitle = `Dec exp ${Date.now()}`;
    await ep.addExpense({ amount: 10, title: janTitle, date: '2099-01-15' });
    await ep.addExpense({ amount: 10, title: decTitle, date: '2099-12-20' });

    await ep.setDateFrom('2099-01-01');
    await ep.setDateTo('2099-06-30');

    await expect(ep.getExpenseByTitle(janTitle)).toBeVisible();
    await expect(ep.getExpenseByTitle(decTitle)).not.toBeVisible();
  });

  test('clearing the date filter restores all expenses', async () => {
    const oldTitle = `Old exp ${Date.now()}`;
    const newTitle = `New exp ${Date.now()}`;
    await ep.addExpense({ amount: 10, title: oldTitle, date: '2099-02-10' });
    await ep.addExpense({ amount: 10, title: newTitle, date: '2099-11-10' });

    await ep.setDateFrom('2099-02-01');
    await ep.setDateTo('2099-02-28');
    await expect(ep.getExpenseByTitle(newTitle)).not.toBeVisible();

    await ep.clearDateFilter();
    await expect(ep.getExpenseByTitle(oldTitle)).toBeVisible();
    await expect(ep.getExpenseByTitle(newTitle)).toBeVisible();
  });

  test('summary total updates when date range narrows the view', async () => {
    const t1 = `Range A ${Date.now()}`;
    const t2 = `Range B ${Date.now()}`;
    await ep.addExpense({ amount: 50, title: t1, date: '2099-03-01' });
    await ep.addExpense({ amount: 70, title: t2, date: '2099-09-01' });

    await ep.setDateFrom('2099-03-01');
    await ep.setDateTo('2099-03-31');

    await expect(ep.getSummaryTotal()).toHaveText('$50.00');
  });
});