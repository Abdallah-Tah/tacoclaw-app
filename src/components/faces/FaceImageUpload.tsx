import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../api/client';

interface FaceImageUploadProps {
  onSuccess: () => void;
}

export const FaceImageUpload: React.FC<FaceImageUploadProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationInfo, setValidationInfo] = useState<{ faces: number; brightness: number; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.match(/image\/(jpeg|png)/)) {
      setError('Only JPEG and PNG images are allowed');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setValidationInfo(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('image', file);

    try {
      const response = await apiClient.post('/faces', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        setSuccess(true);
        setName('');
        setFile(null);
        setPreview(null);
        setValidationInfo(null);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please check image quality.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);
    setValidationInfo(null);
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border border-orange-900/40 bg-black/30">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
        <Upload className="w-4 h-4 text-orange-400" />
        Add New Face
      </h3>

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="text-[10px] font-bold text-orange-200/50 uppercase tracking-widest mb-1.5 block">
            Person Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Smith"
            className="w-full px-3 py-2.5 rounded-xl bg-orange-950/30 border border-orange-900/30 text-orange-200 text-sm placeholder:text-orange-200/25 focus:outline-none focus:border-orange-500/40 transition-colors"
          />
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-orange-400 bg-orange-500/10'
              : preview
                ? 'border-orange-500/30 bg-orange-950/10'
                : 'border-orange-900/30 hover:border-orange-500/40 hover:bg-orange-950/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/jpeg,image/png"
          />

          {preview ? (
            <div className="flex flex-col items-center gap-3">
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/30" />
              <span className="text-xs text-orange-200/50">{file?.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <ImageIcon className="w-8 h-8 text-orange-200/20" />
              <span className="text-sm text-orange-200/40">Drop image here or click to browse</span>
              <span className="text-[10px] text-orange-200/25">JPEG or PNG, max 5MB</span>
            </div>
          )}
        </div>

        {/* Validation Info */}
        {validationInfo && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-emerald-400 font-bold">Face validated</span>
              <span className="text-orange-200/40 ml-2">Brightness: {validationInfo.brightness.toFixed(0)} • Faces: {validationInfo.faces} • {validationInfo.size}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="text-rose-400">{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold">Face validated and added successfully!</span>
          </div>
        )}

        {/* Submit */}
        {file && !success && (
          <button
            onClick={handleUpload}
            disabled={uploading || !name.trim()}
            className="w-full py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-200 text-sm font-bold hover:bg-orange-500/30 disabled:bg-orange-950/30 disabled:text-orange-200/25 disabled:border-orange-900/20 transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>Validating image...</>
            ) : (
              <>Upload & Validate</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};