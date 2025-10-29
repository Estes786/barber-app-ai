// app/protected/page.tsx (Pastikan file ini sudah di-update)
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import UploadForm from './UploadForm'; 

export default async function ProtectedPage() {
  // --- PERBAIKAN: TAMBAHKAN 'await' SAAT MEMANGGIL createClient() ---
  const supabase = await createClient(); 
  // ------------------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser(); // Sekarang 'supabase' sudah menjadi objek klien

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center p-6 min-h-screen bg-gray-100">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Selamat datang, Teknisi Barber!</h1>
        <p className="text-gray-600">Aplikasi Generatif AI Anda siap digunakan.</p>
      </header>
      
      {/* Tempatkan Form Upload di sini */}
      <UploadForm /> 
      
      <form action="/auth/signout" method="post">
        <button className="text-red-500 hover:text-red-700 text-sm">Logout</button>
      </form>
    </div>
  );
}

