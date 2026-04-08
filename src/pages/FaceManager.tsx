import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Navbar } from '../components/layout/Navbar';
import { FaceImageUpload } from '../components/faces/FaceImageUpload';
import apiClient from '../api/client';
import { ArrowLeft, Users, Power, Pencil, Trash2, X, Camera, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Person {
  id: number;
  name: string;
  image_path: string;
  created_at: string;
  is_active: number;
}

export const FaceManager: React.FC = () => {
  useDocumentTitle('Face Manager');
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [editName, setEditName] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchPeople = async () => {
    try {
      const { data } = await apiClient.get('/faces');
      setPeople(data);
    } catch (e) {
      console.error('Failed to fetch faces:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeople(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/faces/${deleteTarget.id}`);
      await fetchPeople();
      setDeleteTarget(null);
    } catch (e) {
      console.error('Failed to delete:', e);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (person: Person) => {
    setTogglingId(person.id);
    try {
      const formData = new FormData();
      formData.append('name', person.name);
      formData.append('is_active', person.is_active ? '0' : '1');
      await apiClient.put(`/faces/${person.id}`, formData);
      await fetchPeople();
    } catch (e) {
      console.error('Failed to toggle active:', e);
    } finally {
      setTogglingId(person.id);
    }
  };

  const openEdit = (person: Person) => {
    setEditPerson(person);
    setEditName(person.name);
    setEditFile(null);
    setEditPreview(`/api/faces/${person.id}/image`);
    setEditUploading(false);
  };

  const handleEditSave = async () => {
    if (!editPerson) return;
    setEditUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', editName.trim());
      if (editFile) formData.append('image', editFile);
      await apiClient.put(`/faces/${editPerson.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchPeople();
      setEditPerson(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update face');
    } finally {
      setEditUploading(false);
    }
  };

  const activeCount = people.filter((p) => p.is_active !== 0).length;

  return (
    <div className="min-h-screen text-orange-50/90 font-sans relative pb-10">
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDE0MCwwLDAuMDUpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />
      <Navbar />

      <main className="relative p-4 sm:p-8 max-w-[1200px] mx-auto z-10">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-orange-200/50 hover:text-orange-200 text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Camera className="w-8 h-8 text-orange-400" />
            Known Faces
          </h1>
          <p className="text-orange-200/60 text-base mt-1">Manage recognized persons for the Blink doorbell system.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 border border-orange-900/40 bg-black/30">
            <div className="text-[10px] font-bold text-orange-200/40 uppercase tracking-widest mb-1">Total Faces</div>
            <div className="text-2xl font-bold text-white">{people.length}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Active</div>
            <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-orange-900/40 bg-black/30">
            <div className="text-[10px] font-bold text-orange-200/40 uppercase tracking-widest mb-1">Recognition</div>
            <div className="text-2xl font-bold text-orange-400">{activeCount > 0 ? 'Enabled' : 'Paused'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Panel */}
          <div className="lg:col-span-1">
            <FaceImageUpload onSuccess={fetchPeople} />
          </div>

          {/* Person Grid */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-5 sm:p-6 border border-orange-900/40 bg-black/30">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
                <Users className="w-4 h-4 text-orange-400" />
                Registered Persons
                <span className="text-[10px] text-orange-200/30 font-mono ml-auto">{people.length} total</span>
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-orange-200/30">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <span className="text-sm">Loading faces...</span>
                </div>
              ) : people.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-orange-200/25">
                  <Users className="w-10 h-10" />
                  <p className="text-sm">No known faces found. Add one above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {people.map((person) => (
                    <div key={person.id} className="glass rounded-xl p-4 border border-orange-900/40 group flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full bg-orange-950/50 border-2 border-orange-900/40 overflow-hidden">
                          <img
                            src={`/api/faces/${person.id}/image`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff8c00"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'; }}
                          />
                        </div>
                        {person.is_active === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500/80 border border-taco-bg" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white truncate">{person.name}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            person.is_active !== 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {person.is_active !== 0 ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <div className="text-[10px] text-orange-200/30 font-mono">
                          Added {new Date(person.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleToggleActive(person)}
                            disabled={togglingId === person.id}
                            className={`p-1.5 rounded-lg transition-colors ${
                              person.is_active !== 0
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-orange-200/30 hover:bg-orange-500/10 hover:text-orange-400'
                            }`}
                            title={person.is_active !== 0 ? 'Deactivate recognition' : 'Activate recognition'}
                          >
                            {togglingId === person.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEdit(person)}
                            className="p-1.5 rounded-lg text-orange-200/30 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(person)}
                            className="p-1.5 rounded-lg text-orange-200/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditPerson(null)} />
          <div className="relative glass rounded-2xl p-6 border border-orange-900/40 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Edit Person</h3>
              <button onClick={() => setEditPerson(null)} className="p-1.5 rounded-lg text-orange-200/40 hover:text-orange-200 hover:bg-orange-500/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current image preview */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-orange-950/50 border-2 border-orange-900/40 overflow-hidden">
                  <img
                    src={editFile ? (editPreview || '') : `/api/faces/${editPerson.id}/image`}
                    alt={editName}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff8c00"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'; }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-orange-200/50 uppercase tracking-widest mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-orange-950/30 border border-orange-900/30 text-orange-200 text-sm focus:outline-none focus:border-orange-500/40"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-orange-200/50 uppercase tracking-widest mb-1.5 block">New Photo (optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setEditFile(f);
                      const reader = new FileReader();
                      reader.onload = (ev) => setEditPreview(ev.target?.result as string);
                      reader.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-sm text-orange-200/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditPerson(null)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-950/30 border border-orange-900/30 text-orange-200/60 text-sm font-bold hover:bg-orange-950/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editUploading || !editName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-200 text-sm font-bold hover:bg-orange-500/30 disabled:bg-orange-950/30 disabled:text-orange-200/25 disabled:border-orange-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  {editUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editUploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative glass rounded-2xl p-6 border border-rose-500/20 w-full max-w-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-500/10">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Delete Face</h3>
                <p className="text-sm text-orange-200/60">
                  Are you sure you want to remove <span className="text-white font-bold">{deleteTarget.name}</span>? This will also delete their photo from the recognition system.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-orange-950/30 border border-orange-900/30 text-orange-200/60 text-sm font-bold hover:bg-orange-950/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-bold hover:bg-rose-500/30 disabled:bg-rose-950/30 disabled:text-rose-400/40 transition-colors flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};