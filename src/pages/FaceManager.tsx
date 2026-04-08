import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Navbar } from '../components/layout/Navbar';
import { FaceImageUpload } from '../components/faces/FaceImageUpload';
import { PersonList } from '../components/faces/PersonList';
import apiClient from '../api/client';

export const FaceManager: React.FC = () => {
  useDocumentTitle('Face Manager');
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeople = async () => {
    try {
      const response = await apiClient.get('/faces');
      setPeople(response.data);
    } catch (e) {
      console.error('Failed to fetch faces:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/faces/${id}`);
      await fetchPeople();
    } catch (e) {
      console.error('Failed to delete face:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Face Management</h1>
          <p className="text-slate-400">Manage known faces for the recognition system.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FaceImageUpload onSuccess={fetchPeople} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-6">Known Persons</h2>
              {loading ? (
                <div className="text-slate-500 text-center py-10">Loading faces...</div>
              ) : people.length === 0 ? (
                <div className="text-slate-500 text-center py-10">No known faces found.</div>
              ) : (
                <PersonList people={people} onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
