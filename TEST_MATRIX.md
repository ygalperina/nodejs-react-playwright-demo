# Test Case Matrix — Task & Expense Manager

**Coverage summary:** 45 automated · 14 gaps identified · 59 total

| Automated | Layer                  | Count |
| --------- | ---------------------- | ----- |
| ✅         | API — Tasks            | 8     |
| ✅         | API — Expenses         | 16    |
| ✅         | E2E — Tasks            | 9     |
| ✅         | E2E — Expenses         | 12    |
| ❌         | Not yet automated      | 14    |

---

## API Tests — Tasks

> File: `tests/api/tasks-api.spec.ts`

| ID     | Feature      | Description                                         | Method & Endpoint           | Input                       | Expected Result                                      | Auto | Priority |
| ------ | ------------ | --------------------------------------------------- | --------------------------- | --------------------------- | ---------------------------------------------------- | ---- | -------- |
| TC-A01 | List Tasks   | Returns 200 and a JSON array                        | `GET /api/tasks`            | —                           | `200`, response is an array                          | ✅   | High     |
| TC-A02 | Create Task  | Creates a task with all fields                      | `POST /api/tasks`           | `{title, description, status}` | `201`, body contains `id`, `title`, `status`      | ✅   | High     |
| TC-A03 | Create Task  | Rejects request when title is missing               | `POST /api/tasks`           | `{description}` only        | `400`, body contains `error`                         | ✅   | High     |
| TC-A04 | Get Task     | Returns task for a valid ID                         | `GET /api/tasks/:id`        | existing `id`               | `200`, task `id` matches                             | ✅   | High     |
| TC-A05 | Get Task     | Returns 404 for a non-existent ID                   | `GET /api/tasks/:id`        | unknown `id`                | `404`                                                | ✅   | High     |
| TC-A06 | Update Task  | Updates task status                                 | `PUT /api/tasks/:id`        | `{status: "in_progress"}`   | `200`, returned task has new status                  | ✅   | High     |
| TC-A07 | Filter Tasks | `?status=` returns only matching tasks              | `GET /api/tasks?status=in_progress` | `status=in_progress`  | `200`, every item has matching status                | ✅   | High     |
| TC-A08 | Delete Task  | Deletes task; follow-up GET returns 404             | `DELETE /api/tasks/:id`     | existing `id`               | `204`; subsequent `GET /:id` → `404`                 | ✅   | High     |
| TC-A09 | Update Task  | Returns 404 when updating non-existent task         | `PUT /api/tasks/:id`        | unknown `id`                | `404`                                                | ❌   | Medium   |
| TC-A10 | Delete Task  | Returns 404 when deleting non-existent task         | `DELETE /api/tasks/:id`     | unknown `id`                | `404`                                                | ❌   | Medium   |
| TC-A11 | Create Task  | Rejects whitespace-only title                       | `POST /api/tasks`           | `{title: "   "}`            | `400`                                                | ❌   | Medium   |
| TC-A12 | Create Task  | Defaults status to `todo` when omitted              | `POST /api/tasks`           | `{title}` only              | `201`, `status === "todo"`                           | ❌   | Low      |
| TC-A13 | Filter Tasks | Returns empty array for unknown status value        | `GET /api/tasks?status=unknown` | `status=unknown`        | `200`, empty array                                   | ❌   | Low      |

---

## API Tests — Expenses

> File: `tests/api/expenses-api.spec.ts`

### CRUD

| ID     | Feature        | Description                                   | Method & Endpoint           | Input                                        | Expected Result                                      | Auto | Priority |
| ------ | -------------- | --------------------------------------------- | --------------------------- | -------------------------------------------- | ---------------------------------------------------- | ---- | -------- |
| TC-B01 | List Expenses  | Returns 200 and a JSON array                  | `GET /api/expenses`         | —                                            | `200`, response is an array                          | ✅   | High     |
| TC-B02 | Create Expense | Creates expense with all required fields      | `POST /api/expenses`        | `{title, amount, category, date}`            | `201`, body contains `id`, `title`, `amount`, `category` | ✅ | High |
| TC-B03 | Create Expense | Rejects when title is missing                 | `POST /api/expenses`        | no `title`                                   | `400`, body contains `error`                         | ✅   | High     |
| TC-B04 | Create Expense | Rejects when amount is missing                | `POST /api/expenses`        | no `amount`                                  | `400`                                                | ✅   | High     |
| TC-B05 | Create Expense | Rejects non-positive amount                   | `POST /api/expenses`        | `{amount: -5}`                               | `400`                                                | ✅   | High     |
| TC-B06 | Get Expense    | Returns expense for a valid ID                | `GET /api/expenses/:id`     | existing `id`                                | `200`, `id` matches                                  | ✅   | High     |
| TC-B07 | Get Expense    | Returns 404 for a non-existent ID             | `GET /api/expenses/:id`     | unknown `id`                                 | `404`                                                | ✅   | High     |
| TC-B08 | Update Expense | Updates title and amount                      | `PUT /api/expenses/:id`     | `{title, amount}`                            | `200`, returned body reflects new values             | ✅   | High     |
| TC-B09 | Delete Expense | Deletes expense; follow-up GET returns 404    | `DELETE /api/expenses/:id`  | existing `id`                                | `204`; subsequent `GET /:id` → `404`                 | ✅   | High     |

### Filtering

| ID     | Feature        | Description                                          | Method & Endpoint                              | Input                                | Expected Result                                      | Auto | Priority |
| ------ | -------------- | ---------------------------------------------------- | ---------------------------------------------- | ------------------------------------ | ---------------------------------------------------- | ---- | -------- |
| TC-B10 | Filter         | `?category=food` returns only food expenses          | `GET /api/expenses?category=food`              | `category=food`                      | `200`, every item has `category === "food"`          | ✅   | High     |
| TC-B11 | Filter         | `?category=transport` returns only transport         | `GET /api/expenses?category=transport`         | `category=transport`                 | `200`, every item has `category === "transport"`     | ✅   | High     |
| TC-B12 | Filter         | Date range returns only expenses within the range    | `GET /api/expenses?from=&to=`                  | `from=2099-03-01`, `to=2099-03-31`   | `200`, includes March expense, excludes April        | ✅   | High     |
| TC-B13 | Filter         | Combined category + date filter narrows results      | `GET /api/expenses?category=food&from=&to=`    | food + March range                   | Returns food/March expense; excludes transport/April | ✅   | High     |

### Summary / Totals

| ID     | Feature | Description                                                     | Method & Endpoint                         | Input                              | Expected Result                                             | Auto | Priority |
| ------ | ------- | --------------------------------------------------------------- | ----------------------------------------- | ---------------------------------- | ----------------------------------------------------------- | ---- | -------- |
| TC-B14 | Summary | Returns correct shape (total, count, by_category)               | `GET /api/expenses/summary`               | —                                  | `200`, body has `total` (number), `count`, `by_category`    | ✅   | High     |
| TC-B15 | Summary | Date-ranged summary returns correct total, count, and breakdown | `GET /api/expenses/summary?from=&to=`     | June 2099 range (food $50 + health $30) | `total=80`, `count=2`, `by_category.food.total=50`     | ✅   | High     |
| TC-B16 | Summary | Category-filtered summary returns single-category total         | `GET /api/expenses/summary?category=food&from=&to=` | food + June 2099 range    | `total=50`, `by_category.health` is undefined               | ✅   | High     |
| TC-B17 | Update  | Returns 404 when updating non-existent expense                  | `PUT /api/expenses/:id`                   | unknown `id`                       | `404`                                                       | ❌   | Medium   |
| TC-B18 | Delete  | Returns 404 when deleting non-existent expense                  | `DELETE /api/expenses/:id`                | unknown `id`                       | `404`                                                       | ❌   | Medium   |
| TC-B19 | Create  | Rejects invalid category value                                  | `POST /api/expenses`                      | `{category: "invalid"}`            | `400`                                                       | ❌   | Medium   |

---

## E2E Tests — Tasks

> Files: `tests/e2e/task-crud.spec.ts`, `tests/e2e/task-filter.spec.ts`

| ID     | Feature        | Description                                              | Steps                                                    | Expected Result                                                    | Auto | Priority |
| ------ | -------------- | -------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ | ---- | -------- |
| TC-E01 | Page Load      | Page loads with form visible                             | Navigate to `/`                                          | Title input and Add button are visible                             | ✅   | High     |
| TC-E02 | Create Task    | Creates task with title and description                  | Fill title + description → click Add                    | Card appears with correct title and description                    | ✅   | High     |
| TC-E03 | Create Task    | Creates task with title only                             | Fill title only → click Add                              | Card appears; no description element rendered                      | ✅   | High     |
| TC-E04 | Delete Task    | Deleted task disappears from the list                    | Add task → click ✕                                       | Card no longer visible                                             | ✅   | High     |
| TC-E05 | Update Status  | Status dropdown updates task status                      | Add task → select "In Progress" from dropdown            | Dropdown reflects new status value                                 | ✅   | High     |
| TC-E06 | Form Reset     | Form clears after successful submission                  | Fill form → click Add                                    | Title input value is empty                                         | ✅   | Medium   |
| TC-E07 | Create Task    | Empty title does not create a task                       | Click Add with empty title input                         | No new card added                                                  | ❌   | High     |
| TC-E08 | Filter         | "Done" filter shows only done tasks                      | Add two tasks → mark one Done → click Done tab           | Done task visible; Todo task hidden                                | ✅   | High     |
| TC-E09 | Filter         | "To Do" filter shows only todo tasks                     | Add two tasks → mark one In Progress → click To Do tab   | Todo task visible; In Progress hidden                              | ✅   | High     |
| TC-E10 | Filter         | "All" tab restores full task list                        | Apply status filter → click All tab                      | All tasks visible                                                  | ✅   | High     |
| TC-E11 | Filter         | "In Progress" filter shows only in-progress tasks        | Add two tasks → mark one In Progress → click tab         | In Progress visible; others hidden                                 | ❌   | Medium   |
| TC-E12 | Error Handling | API error surfaces an error banner                       | Simulate server unavailability                           | Red error banner visible                                           | ❌   | Medium   |
| TC-E13 | Accessibility  | All form controls are keyboard-navigable                 | Tab through the page                                     | Focus moves through inputs and buttons in logical order            | ❌   | Low      |

---

## E2E Tests — Expenses

> Files: `tests/e2e/expense-crud.spec.ts`, `tests/e2e/expense-totals.spec.ts`

| ID     | Feature            | Description                                              | Steps                                                              | Expected Result                                                        | Auto | Priority |
| ------ | ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---- | -------- |
| TC-F01 | Page Load          | Expenses page loads with add form visible                | Navigate to Expenses view                                          | Amount input, title input, and Add button are visible                  | ✅   | High     |
| TC-F02 | Create Expense     | Adds expense with all fields                             | Fill amount, title, category, notes → click Add                   | Card shows correct amount, category badge, and notes                   | ✅   | High     |
| TC-F03 | Create Expense     | Adds expense with required fields only                   | Fill amount + title → click Add                                    | Card appears in list                                                   | ✅   | High     |
| TC-F04 | Delete Expense     | Deleted expense disappears from the list                 | Add expense → click delete                                         | Card no longer visible                                                 | ✅   | High     |
| TC-F05 | Form Reset         | Form clears after successful submission                  | Fill form → click Add                                              | Amount and title inputs are empty                                      | ✅   | Medium   |
| TC-F06 | Totals             | Summary total reflects all visible expenses              | Set date range to 2099 → add two expenses ($40 + $60)             | Summary total shows `$100.00`                                          | ✅   | High     |
| TC-F07 | Totals             | Summary shows per-category breakdown                     | Add food ($25) and transport ($15) in July 2099 → narrow to July  | Food row shows `$25.00`; transport row shows `$15.00`                  | ✅   | High     |
| TC-F08 | Category Filter    | Category filter shows only matching expenses             | Add food + health expenses → select food filter                    | Food expense visible; health expense hidden                            | ✅   | High     |
| TC-F09 | Category Filter    | "All" category restores full list                        | Apply category filter → select "All"                               | All expenses visible                                                   | ✅   | High     |
| TC-F10 | Date Filter        | Date range hides expenses outside the range              | Add Jan + Dec expense → filter to Jan–Jun                          | Jan expense visible; Dec expense hidden                                | ✅   | High     |
| TC-F11 | Date Filter        | Clearing the date filter restores all expenses           | Filter to a narrow range → click Clear                             | Both expenses visible                                                  | ✅   | High     |
| TC-F12 | Date Filter + Total| Summary total updates when date range narrows            | Add Mar ($50) + Sep ($70) expenses → filter to March               | Summary shows `$50.00`                                                 | ✅   | High     |
| TC-F13 | Validation         | Zero or negative amount shows a validation error         | Enter `0` or `-5` in amount → click Add                           | Error message visible; no new card added                               | ❌   | High     |
| TC-F14 | Error Handling     | API error surfaces an error banner on the expenses view  | Simulate server unavailability                                     | Red error banner visible                                               | ❌   | Medium   |

---

## Gap Summary

| ID     | Why Not Automated                                               | Suggested Approach                                                            |
| ------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| TC-A09 | Not covered in current suite                                    | Add to `tasks-api.spec.ts`                                                    |
| TC-A10 | Not covered in current suite                                    | Add to `tasks-api.spec.ts`                                                    |
| TC-A11 | Whitespace edge case untested                                   | Add to `tasks-api.spec.ts`                                                    |
| TC-A12 | Default value assumption unchecked                              | Add to `tasks-api.spec.ts`                                                    |
| TC-A13 | Invalid query param behaviour undefined                         | Add to `tasks-api.spec.ts`; add server-side validation                        |
| TC-B17 | Not covered in current suite                                    | Add to `expenses-api.spec.ts`                                                 |
| TC-B18 | Not covered in current suite                                    | Add to `expenses-api.spec.ts`                                                 |
| TC-B19 | SQLite `CHECK` constraint returns 500, not 400                  | Add server-side category validation before DB insert; then add test           |
| TC-E07 | HTML5 `required` attribute blocks submit; test was removed      | Re-add using `evaluate()` to bypass native validation, or test error state    |
| TC-E11 | Only Done and Todo filter tabs are covered                      | Add to `task-filter.spec.ts`                                                  |
| TC-E12 | Requires route interception                                     | Use `page.route()` to mock a failed API response                              |
| TC-E13 | Needs keyboard + ARIA audit                                     | Use `page.keyboard.press('Tab')` + `axe-playwright`                           |
| TC-F13 | Client uses `min="0.01"` HTML attribute; test needs bypass      | Use `inputValue` + `evaluate()` to set invalid value, or test error message   |
| TC-F14 | Requires route interception on the expenses view                | Use `page.route()` to mock a failed API response                              |