import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, field: 'responsibilities' | 'results') => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onToggleSubtask, onDelete, onEdit }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  return (
    <div className="card hover:shadow-xl transition-shadow relative group">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-lg hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-700 shadow-lg py-1">
            <button
              onClick={() => {
                onEdit(task);
                setShowMenu(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Task</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Task</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start pr-8">
        <h3 className="font-semibold text-lg text-gray-100">{task.title}</h3>
        <div className="flex gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-400 mt-2">{task.description}</p>
      )}

      <div className="mt-4 space-y-2">
        <button
          onClick={() => onToggleSubtask(task.id, 'responsibilities')}
          className="flex items-center space-x-2 w-full p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {task.responsibilities_completed ? (
            <CheckSquare className="w-5 h-5 text-orange-500" />
          ) : (
            <Square className="w-5 h-5 text-gray-500" />
          )}
          <span className="text-gray-300">Responsibilities</span>
        </button>

        <button
          onClick={() => onToggleSubtask(task.id, 'results')}
          className="flex items-center space-x-2 w-full p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {task.results_completed ? (
            <CheckSquare className="w-5 h-5 text-orange-500" />
          ) : (
            <Square className="w-5 h-5 text-gray-500" />
          )}
          <span className="text-gray-300">Results</span>
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-400 hover:text-gray-300 mt-2"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-700">
            {task.responsibilities && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Responsibilities:</h4>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{task.responsibilities}</p>
              </div>
            )}
            {task.results && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Expected Results:</h4>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{task.results}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}