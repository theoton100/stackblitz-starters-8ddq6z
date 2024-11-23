import React, { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import type { Task, TaskFormData } from '../types/task';
import toast from 'react-hot-toast';

interface Profile {
  full_name: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    if (user) {
      loadTasks();
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateOrUpdateTask = async (formData: TaskFormData) => {
    try {
      const taskData = {
        ...formData,
        responsibilities: formData.responsibilities || null,
        results: formData.results || null,
        updated_at: new Date().toISOString(),
      };

      if (selectedTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', selectedTask.id);

        if (error) throw error;
        toast.success('Task updated successfully');
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...taskData,
            user_id: user?.id,
            responsibilities_completed: false,
            results_completed: false,
          }]);

        if (error) throw error;
        toast.success('Task created successfully');
      }
      
      loadTasks();
      setSelectedTask(undefined);
    } catch (error) {
      toast.error(selectedTask ? 'Failed to update task' : 'Failed to create task');
      console.error('Error with task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleSubtask = async (taskId: string, field: 'responsibilities' | 'results') => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({
          [`${field}_completed`]: !task[`${field}_completed`],
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;
      
      loadTasks();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-400">Welcome back, {profile?.full_name || 'User'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleSubtask={handleToggleSubtask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateTask}
        task={selectedTask}
      />
    </div>
  );
}