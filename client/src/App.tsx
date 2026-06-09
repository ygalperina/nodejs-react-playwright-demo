import { useEffect, useState, useCallback } from 'react';
import { Task, TaskStatus } from './types/task';
import { tasksApi } from './api/tasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { FilterTabs, Filter } from './components/FilterTabs';
import { ExpensesView } from './expenses/ExpensesView';

type View = 'tasks' | 'expenses';

export default function App() {
  const [view, setView]       = useState<View>('tasks');
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [filter, setFilter]   = useState<Filter>('all');
  const [error, setError]     = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await tasksApi.getAll(filter === 'all' ? undefined : filter));
    } catch {
      setError('Failed to load tasks');
    }
  }, [filter]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleCreate = async (payload: { title: string; description?: string }) => {
    try {
      const task = await tasksApi.create(payload);
      if (filter === 'all' || filter === 'todo') setTasks((prev) => [task, ...prev]);
    } catch {
      setError('Failed to create task');
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      const updated = await tasksApi.update(id, { status });
      setTasks((prev) =>
        filter === 'all' ? prev.map((t) => (t.id === id ? updated : t)) : prev.filter((t) => t.id !== id)
      );
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {view === 'tasks' ? 'Task Manager' : 'Expense Tracker'}
          </h1>
          <nav className="flex gap-1">
            <button
              onClick={() => setView('tasks')}
              data-testid="nav-tasks"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                view === 'tasks' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setView('expenses')}
              data-testid="nav-expenses"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                view === 'expenses' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Expenses
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {view === 'tasks' ? (
          <>
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4" role="alert">
                {error}
                <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
              </div>
            )}
            <TaskForm onSubmit={handleCreate} />
            <FilterTabs active={filter} onChange={setFilter} />
            <div className="flex flex-col gap-3" data-testid="task-list">
              {tasks.length === 0 && (
                <p className="text-center text-gray-400 py-8" data-testid="empty-state">
                  No tasks yet. Add one above!
                </p>
              )}
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              ))}
            </div>
          </>
        ) : (
          <ExpensesView />
        )}
      </main>
    </div>
  );
}