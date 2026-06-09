import { useEffect, useState, useCallback } from 'react';
import { Task, TaskStatus } from './types/task';
import { tasksApi } from './api/tasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { FilterTabs, Filter } from './components/FilterTabs';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await tasksApi.getAll(filter === 'all' ? undefined : filter);
      setTasks(data);
    } catch {
      setError('Failed to load tasks');
    }
  }, [filter]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleCreate = async (payload: { title: string; description?: string }) => {
    try {
      const task = await tasksApi.create(payload);
      if (filter === 'all' || filter === 'todo') {
        setTasks((prev) => [task, ...prev]);
      }
    } catch {
      setError('Failed to create task');
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      const updated = await tasksApi.update(id, { status });
      if (filter === 'all') {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
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
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
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
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}