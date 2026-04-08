import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../../api/client';

interface FaceImageUploadProps {
  onSuccess: () => void;
}

export const FaceImageUpload: React.FC<FaceImageUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.post('/faces/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        setSuccess(true);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please check image quality.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-bold mb-4">Add New Face</h3>
      <div className="flex flex-col gap-4">
        <div className="relative border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange} 
            accept="image/*"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-slate-500" />
            <span className="text-slate-400 text-sm">
              {file ? file.name : 'Click to upload face image'}
            </span>
          </div>
        </div>

        {file && !success && (
          <button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            {uploading ? 'Validating Image...' : 'Upload & Validate'}
          </button>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Face validated and added successfully!
          </div>
        )}
      </div>
    </div>
  );
};
