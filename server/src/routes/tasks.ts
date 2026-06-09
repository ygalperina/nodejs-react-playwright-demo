import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks: any[] = status
    ? db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC').all(status as string)
    : db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(tasks);
});

router.get('/:id', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const task: any = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

router.post('/', (req: Request, res: Response) => {
  const { title, description = '', status = 'todo' } = req.body;
  if (!title?.trim()) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const result = db
    .prepare('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)')
    .run(title.trim(), description, status);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(Number(result.lastInsertRowid));
  res.status(201).json(task);
});

router.put('/:id', (req: Request, res: Response) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { title, description, status } = req.body;
  db.prepare(`
    UPDATE tasks
    SET title       = COALESCE(?, title),
        description = COALESCE(?, description),
        status      = COALESCE(?, status),
        updated_at  = datetime('now')
    WHERE id = ?
  `).run(title ?? null, description ?? null, status ?? null, req.params.id);
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req: Request, res: Response) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;