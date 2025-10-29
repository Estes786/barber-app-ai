// app/protected/UploadForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Import client Supabase

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
    setCaption('');
    setUploadUrl(null);
    setError(null);
  };

  const handleUploadAndCaption = async () => {
    if (!file) {
      alert('Pilih file gambar dulu!');
      return;
    }

    setLoading(true);
    setError(null);
    setCaption('');
    setUploadUrl(null);

    try {
      // --- LANGKAH A: UPLOAD KE SUPABASE STORAGE ---
      const filePath = `barber-results/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images') // Ganti 'images' jika Anda menggunakan nama bucket lain
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik dari file yang diunggah
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicImageUrl = publicUrlData.publicUrl;
      setUploadUrl(publicImageUrl);

      // --- LANGKAH B: PANGGIL API GENERASI CAPTION ---
      const apiResponse = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: publicImageUrl }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Gagal generate caption dari AI.');
      }

      const result = await apiResponse.json();
      setCaption(result.caption);

    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-800">✂️ Proses Hasil Potongan</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Pilih Gambar Hasil Potongan</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
      </div>

      <button
        onClick={handleUploadAndCaption}
        disabled={loading || !file}
        className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? 'Memproses AI...' : 'Upload & Generate Caption'}
      </button>

      {error && (
        <p className="text-red-600 border border-red-300 p-2 rounded-md">Error: {error}</p>
      )}

      {caption && (
        <div className="pt-4 border-t mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Caption Generatif Siap Dibagikan:</h3>
          <blockquote className="mt-2 p-3 border-l-4 border-blue-500 bg-blue-50 text-gray-700 italic">
            "{caption}"
          </blockquote>
          {uploadUrl && (
            <>
              <p className="mt-2 text-sm text-gray-600">URL Gambar (untuk referensi): <a href={uploadUrl} target="_blank" className="text-blue-500 truncate">{uploadUrl}</a></p>
              <img src={uploadUrl} alt="Hasil Upload" className="mt-3 w-full h-auto object-cover rounded-md shadow" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

