import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LifeArea, TaskFormData, Task } from '../types/task';

const LIFE_AREAS: LifeArea[] = ['Family', 'Finances', 'Relationship', 'Faith', 'Health', 'Purpose'];

const INITIAL_FORM_DATA: TaskFormData = {
  title: '',
  description: '',
  responsibilities: '',
  results: '',
  tags: [],
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Task;
}

export default function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        responsibilities: task.responsibilities || '',
        results: task.results || '',
        tags: task.tags,
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  const toggleTag = (tag: LifeArea) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input
              id="title"
              type="text"
              required
              className="input"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              className="input min-h-[80px]"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional task description..."
            />
          </div>

          <div>
            <label htmlFor="responsibilities" className="label">Responsibilities</label>
            <textarea
              id="responsibilities"
              className="input min-h-[80px]"
              value={formData.responsibilities}
              onChange={e => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label htmlFor="results" className="label">Expected Results</label>
            <textarea
              id="results"
              className="input min-h-[80px]"
              value={formData.results}
              onChange={e => setFormData(prev => ({ ...prev, results: e.target.value }))}
              placeholder="What are the expected outcomes?"
            />
          </div>

          <div>
            <label className="label">Life Areas</label>
            <div className="flex flex-wrap gap-2">
              {LIFE_AREAS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}