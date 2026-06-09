import { Task, TaskStatus } from '../types/task';

interface Props {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

export function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

  return (
    <div
      className="bg-white rounded-lg shadow p-4 flex items-start justify-between gap-3"
      data-testid="task-card"
      data-task-id={task.id}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate" data-testid="task-title">
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-gray-500 mt-0.5 truncate" data-testid="task-description">
            {task.description}
          </p>
        )}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className={`mt-2 text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[task.status]}`}
          data-testid="task-status-select"
          aria-label="Task status"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
        data-testid="delete-task-button"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}