import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Auth/AuthContext';
import { db } from '../../firebase';
import Autocomplete from 'react-google-autocomplete';

const CreatePost = () => {
  const { currentUser } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Create a new post document
      const postData = {
        userId: currentUser.uid,
        location: data.location.formatted_address,
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: serverTimestamp(),
      };

      const postCollection = collection(db, 'posts');
      await addDoc(postCollection, postData);

      // Clear form fields after submission
      setValue('location', '');
      setValue('startDate', '');
      setValue('endDate', '');

      setLoading(false);

      // Redirect or perform other actions on successful submission
      // (e.g., redirect to the home page)
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-4 md:w-1/2 rounded-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-semibold">
            Location
          </label>
          <Autocomplete
            apiKey="AIzaSyCuLWuljM61jAXvLr3mDcQYTI3B8GTEeig"
            id="location"
            {...register('location', { required: true })}
            className="w-full px-4 py-2 border rounded-md mt-2 bg-black text-white"
            placeholder="Enter your location"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <label htmlFor="startDate" className="block text-sm font-semibold">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            {...register('startDate', { required: true })}
            className="w-full px-4 py-2 border rounded-md mt-2 bg-black text-white"
          />

          <label htmlFor="endDate" className="block text-sm font-semibold">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            {...register('endDate', { required: true })}
            className="w-full px-4 py-2 border rounded-md mt-2 bg-black text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md transition duration-300 hover:bg-white hover:text-black"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
