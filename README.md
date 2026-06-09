# Task & Expense Manager — Node.js · React · Playwright

![CI](https://github.com/YuliyaG/nodejs-react-playwright-demo/actions/workflows/ci.yml/badge.svg)

A full-stack CRUD app built to demonstrate modern QA engineering practices: Playwright for both UI and API testing, Page Object Model, and CI with HTML test reports.

## Features

- **Task Manager** — create, update status, and delete tasks with filter tabs
- **Expense Tracker** — add expenses by category, filter by date range or category, and view running totals with per-category breakdown

## What's tested

| Layer    | Approach                       | Coverage                                                                    |
| -------- | ------------------------------ | --------------------------------------------------------------------------- |
| REST API | Playwright API testing         | CRUD, validation, 404s, filtering, summary totals                           |
| UI (E2E) | Playwright + Page Object Model | Create, delete, status change, filter tabs, expense totals, date filtering  |

45 automated tests across 2 projects (`api` + `chromium`). See [TEST_MATRIX.md](TEST_MATRIX.md) for the full test case inventory.

## Stack

| Layer    | Tech                                               |
| -------- | -------------------------------------------------- |
| Frontend | React 18, TypeScript, Tailwind CSS (Vite 8)        |
| Backend  | Node.js 24, Express, TypeScript                    |
| Database | SQLite via built-in `node:sqlite` (`DatabaseSync`) |
| Tests    | Playwright (UI + API)                              |
| CI       | GitHub Actions                                     |

## Getting started

**Prerequisites:** Node.js 24+

```bash
npm install
```

### Run in development

```bash
# Terminal 1 — API server → http://localhost:3001
npm run dev:server

# Terminal 2 — React app → http://localhost:5173
npm run dev:client
```

### Run tests

Playwright starts both servers automatically.

```bash
# All tests (45 total)
npm test

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e

# Open HTML report
npm run test:report
```

## Project structure

```
/client                       React + TypeScript + Tailwind
  /src
    /api                      fetch wrappers (tasks, expenses, shared client)
    /components               TaskCard, TaskForm, FilterTabs
    /expenses                 ExpensesView, ExpenseSummary, DateRangeFilter
    /types                    Task and Expense interfaces

/server                       Express + TypeScript + SQLite
  /src
    db.ts                     SQLite setup (tasks + expenses tables)
    index.ts                  app entry point
    /routes
      tasks.ts                task CRUD handlers
      expenses.ts             expense CRUD + filtering + summary handlers

/tests
  /api
    tasks-api.spec.ts         Playwright API tests — tasks
    expenses-api.spec.ts      Playwright API tests — expenses (CRUD, filtering, summary)
  /e2e
    /pages
      TasksPage.ts            Page Object — tasks
      ExpensesPage.ts         Page Object — expenses
    task-crud.spec.ts         task create / delete / update tests
    task-filter.spec.ts       filter tab tests
    expense-crud.spec.ts      expense create / delete tests
    expense-totals.spec.ts    totals, per-category breakdown, date filtering tests

playwright.config.ts          projects: api + chromium, webServer auto-start
TEST_MATRIX.md                test case matrix (26 cases, coverage gaps)
.github/workflows/ci.yml      runs tests on every push, uploads HTML report
```

## API reference

### Tasks

| Method     | Path              | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| `GET`      | `/api/tasks`      | List all tasks (optional `?status=` filter)  |
| `POST`     | `/api/tasks`      | Create a task                                |
| `GET`      | `/api/tasks/:id`  | Get a task by ID                             |
| `PUT`      | `/api/tasks/:id`  | Update title / description / status          |
| `DELETE`   | `/api/tasks/:id`  | Delete a task                                |

### Expenses

| Method     | Path                      | Description                                                   |
| ---------- | ------------------------- | ------------------------------------------------------------- |
| `GET`      | `/api/expenses`           | List expenses (optional `?category=`, `?from=`, `?to=` filters) |
| `POST`     | `/api/expenses`           | Create an expense                                             |
| `GET`      | `/api/expenses/summary`   | Aggregated totals by category (same filters supported)        |
| `GET`      | `/api/expenses/:id`       | Get an expense by ID                                          |
| `PUT`      | `/api/expenses/:id`       | Update fields                                                 |
| `DELETE`   | `/api/expenses/:id`       | Delete an expense                                             |

**Expense categories:** `food` · `transport` · `housing` · `entertainment` · `health` · `other`

**Date filter format:** `YYYY-MM-DD` — both `from` and `to` are inclusive.