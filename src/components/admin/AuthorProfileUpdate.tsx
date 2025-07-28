import React, { useState, useEffect } from 'react';
import { apiClient } from '@/integrations/client';

const ProfileForm = () => {
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('accounts/users/me/');
        setBio(response.data.bio || '');
        setImageUrl(response.data.image_url || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.put('accounts/profile/', { bio, imageUrl });
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Bio:</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Image URL:</label>
      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;