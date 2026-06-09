import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

type QueryParams = Record<string, unknown>;

function buildFilter(query: QueryParams): { where: string; params: (string | number)[] } {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  if (query.category) { conditions.push('category = ?'); params.push(query.category as string); }
  if (query.from)     { conditions.push('date >= ?');    params.push(query.from as string); }
  if (query.to)       { conditions.push('date <= ?');    params.push(query.to as string); }
  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

// Must be declared before /:id to avoid "summary" being treated as an id
router.get('/summary', (req: Request, res: Response) => {
  const { where, params } = buildFilter(req.query);

  const rows = db
    .prepare(`SELECT category, SUM(amount) AS total, COUNT(*) AS count FROM expenses ${where} GROUP BY category`)
    .all(...params) as { category: string; total: number; count: number | bigint }[];

  const totals = db
    .prepare(`SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count FROM expenses ${where}`)
    .get(...params) as { total: number; count: number | bigint };

  const by_category: Record<string, { total: number; count: number }> = {};
  for (const r of rows) {
    by_category[r.category] = { total: r.total, count: Number(r.count) };
  }

  res.json({ total: totals.total, count: Number(totals.count), by_category });
});

router.get('/', (req: Request, res: Response) => {
  const { where, params } = buildFilter(req.query);
  res.json(
    db.prepare(`SELECT * FROM expenses ${where} ORDER BY date DESC, created_at DESC`).all(...params)
  );
});

router.get('/:id', (req: Request, res: Response) => {
  const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!expense) { res.status(404).json({ error: 'Expense not found' }); return; }
  res.json(expense);
});

router.post('/', (req: Request, res: Response) => {
  const { title, amount, category, date, notes = '' } = req.body;
  if (!title?.trim())                                           { res.status(400).json({ error: 'Title is required' }); return; }
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) { res.status(400).json({ error: 'Amount must be a positive number' }); return; }
  if (!category)                                                { res.status(400).json({ error: 'Category is required' }); return; }
  if (!date)                                                    { res.status(400).json({ error: 'Date is required' }); return; }

  const result = db
    .prepare('INSERT INTO expenses (title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)')
    .run(title.trim(), Number(amount), category, date, notes);

  res.status(201).json(
    db.prepare('SELECT * FROM expenses WHERE id = ?').get(Number(result.lastInsertRowid))
  );
});

router.put('/:id', (req: Request, res: Response) => {
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!existing) { res.status(404).json({ error: 'Expense not found' }); return; }

  const { title, amount, category, date, notes } = req.body;
  db.prepare(`
    UPDATE expenses
    SET title      = COALESCE(?, title),
        amount     = COALESCE(?, amount),
        category   = COALESCE(?, category),
        date       = COALESCE(?, date),
        notes      = COALESCE(?, notes),
        updated_at = datetime('now')
    WHERE id = ?
  `).run(
    title ?? null,
    amount !== undefined ? Number(amount) : null,
    category ?? null,
    date ?? null,
    notes ?? null,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req: Request, res: Response) => {
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!existing) { res.status(404).json({ error: 'Expense not found' }); return; }
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;