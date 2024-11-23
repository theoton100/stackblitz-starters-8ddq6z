import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    id: user?.id || '',
    full_name: '',
  });
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const updateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success('Email update initiated. Please check your new email for verification.');
      setNewEmail('');
    } catch (error) {
      toast.error('Failed to update email');
      console.error('Error updating email:', error);
    }
  };

  const updatePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="input"
                value={profile.full_name}
                onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <button onClick={updateProfile} className="btn btn-primary">
              Update Profile
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="label">New Email Address</label>
              <input
                id="newEmail"
                type="email"
                className="input"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
            </div>
            <button
              onClick={updateEmail}
              disabled={!newEmail}
              className="btn btn-primary disabled:opacity-50"
            >
              Update Email
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="label">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button
              onClick={updatePassword}
              disabled={!newPassword}
              className="btn btn-primary disabled:opacity-50"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}