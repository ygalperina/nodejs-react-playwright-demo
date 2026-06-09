# Test Case Matrix — Task Manager

**Coverage summary:** 17 automated · 9 gaps identified · 26 total

| Automated | Layer | Count |
|---|---|---|
| ✅ | API (Playwright API) | 8 |
| ✅ | E2E (Playwright + POM) | 9 |
| ❌ | Not yet automated | 9 |

---

## API Tests

> File: `tests/api/tasks-api.spec.ts`  
> Precondition: API server running on `http://localhost:3001`

| ID | Feature | Description | Method & Endpoint | Input | Expected Result | Automated | Priority |
|---|---|---|---|---|---|---|---|
| TC-A01 | List Tasks | Returns 200 and a JSON array | `GET /api/tasks` | — | `200`, response is an array | ✅ | High |
| TC-A02 | Create Task | Creates a task with all fields | `POST /api/tasks` | `{title, description, status}` | `201`, body contains `id`, `title`, `status` | ✅ | High |
| TC-A03 | Create Task | Rejects request when title is missing | `POST /api/tasks` | `{description}` only | `400`, body contains `error` field | ✅ | High |
| TC-A04 | Get Task | Returns task for a valid ID | `GET /api/tasks/:id` | existing `id` | `200`, task `id` matches request | ✅ | High |
| TC-A05 | Get Task | Returns 404 for a non-existent ID | `GET /api/tasks/:id` | unknown `id` | `404` | ✅ | High |
| TC-A06 | Update Task | Updates task status | `PUT /api/tasks/:id` | `{status: "in_progress"}` | `200`, returned task has new status | ✅ | High |
| TC-A07 | Filter Tasks | `?status=` returns only matching tasks | `GET /api/tasks?status=in_progress` | `status=in_progress` | `200`, every item in array has matching status | ✅ | High |
| TC-A08 | Delete Task | Deletes task; follow-up GET returns 404 | `DELETE /api/tasks/:id` | existing `id` | `204`; subsequent `GET /:id` → `404` | ✅ | High |
| TC-A09 | Update Task | Returns 404 when updating non-existent task | `PUT /api/tasks/:id` | unknown `id` | `404` | ❌ | Medium |
| TC-A10 | Delete Task | Returns 404 when deleting non-existent task | `DELETE /api/tasks/:id` | unknown `id` | `404` | ❌ | Medium |
| TC-A11 | Create Task | Rejects whitespace-only title | `POST /api/tasks` | `{title: "   "}` | `400` | ❌ | Medium |
| TC-A12 | Create Task | Defaults status to `todo` when omitted | `POST /api/tasks` | `{title}` only | `201`, `status === "todo"` | ❌ | Low |
| TC-A13 | Filter Tasks | Returns empty array for unknown status value | `GET /api/tasks?status=unknown` | `status=unknown` | `200`, empty array | ❌ | Low |

---

## E2E Tests

> Files: `tests/e2e/task-crud.spec.ts`, `tests/e2e/task-filter.spec.ts`  
> Precondition: App running at `http://localhost:5173`; API server running at `http://localhost:3001`

| ID | Feature | Description | Steps | Expected Result | Automated | Priority |
|---|---|---|---|---|---|---|
| TC-E01 | Page Load | Page loads with correct title and form visible | Navigate to `/` | Page title is "Task Manager"; title input and Add button are visible | ✅ | High |
| TC-E02 | Create Task | Creates task with title and description | Fill title + description → click Add | Card appears with correct title and description text | ✅ | High |
| TC-E03 | Create Task | Creates task with title only | Fill title only → click Add | Card appears; no description element rendered | ✅ | High |
| TC-E04 | Delete Task | Deleted task disappears from the list | Add task → click ✕ | Card no longer visible in task list | ✅ | High |
| TC-E05 | Update Status | Status dropdown updates task status | Add task → select "In Progress" from dropdown | Dropdown reflects new status value | ✅ | High |
| TC-E06 | Form Reset | Form clears after successful submission | Fill form → click Add | Title input value is empty | ✅ | Medium |
| TC-E07 | Create Task | Empty title does not create a task | Click Add with empty title input | No new card added to the list | ❌ | High |
| TC-E08 | Filter | "Done" filter shows only done tasks | Add two tasks → mark one Done → click Done tab | Done task visible; Todo task hidden | ✅ | High |
| TC-E09 | Filter | "To Do" filter shows only todo tasks | Add two tasks → mark one In Progress → click To Do tab | Todo task visible; In Progress task hidden | ✅ | High |
| TC-E10 | Filter | "All" tab restores full task list | Apply a status filter → click All tab | All tasks visible regardless of status | ✅ | High |
| TC-E11 | Filter | "In Progress" filter shows only in-progress tasks | Add two tasks → mark one In Progress → click In Progress tab | In Progress task visible; other tasks hidden | ❌ | Medium |
| TC-E12 | Error Handling | API error surfaces an error banner | Simulate server unavailability | Red error banner visible on the page | ❌ | Medium |
| TC-E13 | Accessibility | All form controls are keyboard-navigable | Tab through the page | Focus moves through inputs and buttons in logical order | ❌ | Low |

---

## Gap Summary

| ID | Why Not Automated | Suggested Approach |
|---|---|---|
| TC-A09 | Not covered in current suite | Add to `tasks-api.spec.ts` |
| TC-A10 | Not covered in current suite | Add to `tasks-api.spec.ts` |
| TC-A11 | Whitespace edge case untested | Add to `tasks-api.spec.ts` |
| TC-A12 | Default value assumption unchecked | Add to `tasks-api.spec.ts` |
| TC-A13 | Invalid query param behaviour undefined | Add to `tasks-api.spec.ts`; consider adding server-side validation |
| TC-E07 | HTML5 `required` attribute blocks submit, test was removed | Re-add using `evaluate()` to bypass native validation or test error state |
| TC-E11 | Only Done and Todo filter tabs are covered | Add to `task-filter.spec.ts` |
| TC-E12 | Requires service worker or route interception | Use `page.route()` to mock a failed API response |
| TC-E13 | Needs keyboard + ARIA audit | Use `page.keyboard.press('Tab')` + `axe-playwright` |