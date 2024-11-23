import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LifeArea } from '../types/task';
import toast from 'react-hot-toast';

interface Goals {
  id?: string;
  user_id: string;
  family?: string;
  finances?: string;
  relationship?: string;
  faith?: string;
  health?: string;
  purpose?: string;
}

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goals>({
    user_id: user?.id || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setGoals(data);
    } catch (error) {
      toast.error('Failed to load goals');
      console.error('Error loading goals:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = goals.id
        ? await supabase
            .from('goals')
            .update(goals)
            .eq('id', goals.id)
        : await supabase
            .from('goals')
            .insert([goals]);

      if (error) throw error;
      
      toast.success('Goals saved successfully');
      setIsEditing(false);
      loadGoals();
    } catch (error) {
      toast.error('Failed to save goals');
      console.error('Error saving goals:', error);
    }
  };

  const handleChange = (area: LifeArea, value: string) => {
    setGoals(prev => ({
      ...prev,
      [area.toLowerCase()]: value,
    }));
  };

  const areas: LifeArea[] = ['Family', 'Finances', 'Relationship', 'Faith', 'Health', 'Purpose'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Life Goals</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn btn-primary"
        >
          {isEditing ? 'Save Goals' : 'Edit Goals'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {areas.map(area => (
          <div key={area} className="card">
            <h2 className="text-xl font-semibold mb-4">{area}</h2>
            {isEditing ? (
              <textarea
                className="input min-h-[150px]"
                value={goals[area.toLowerCase() as keyof Goals] || ''}
                onChange={e => handleChange(area, e.target.value)}
                placeholder={`What are your ${area.toLowerCase()} goals?`}
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap min-h-[100px]">
                {goals[area.toLowerCase() as keyof Goals] || 'No goals set yet.'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}