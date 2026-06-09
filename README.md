# Task Manager — Node.js · React · Playwright

![CI](https://github.com/YuliyaG/nodejs-react-playwright-demo/actions/workflows/ci.yml/badge.svg)

A full-stack CRUD app built to demonstrate modern QA engineering practices: Playwright for both UI and API testing, Page Object Model, and CI with HTML test reports.

## What's tested

| Layer | Approach | Coverage |
|---|---|---|
| REST API | Playwright API testing | CRUD, validation, 404s, status filtering |
| UI (E2E) | Playwright + Page Object Model | Create, delete, status change, filter tabs |

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS (Vite) |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite via `better-sqlite3` |
| Tests | Playwright (UI + API) |
| CI | GitHub Actions |

## Getting started

**Prerequisites:** Node.js 20+

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
# All tests
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
/client                   React + TypeScript + Tailwind
  /src
    /api                  fetch wrappers
    /components           TaskCard, TaskForm, FilterTabs
    /types                Task interface and types

/server                   Express + TypeScript + SQLite
  /src
    db.ts                 SQLite setup
    index.ts              app entry point
    /routes/tasks.ts      CRUD route handlers

/tests
  /api
    tasks-api.spec.ts     Playwright API tests
  /e2e
    /pages/TasksPage.ts   Page Object
    task-crud.spec.ts     create / delete / update tests
    task-filter.spec.ts   filter tab tests

playwright.config.ts      projects: api + chromium, webServer auto-start
.github/workflows/ci.yml  runs tests on every push, uploads HTML report
```

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks (optional `?status=` filter) |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a task by ID |
| `PUT` | `/api/tasks/:id` | Update title / description / status |
| `DELETE` | `/api/tasks/:id` | Delete a task |