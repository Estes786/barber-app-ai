// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers' // CUKUP IMPORT 'cookies' SAJA

// Kita biarkan 'ReadonlyRequestCookies' dikenali secara global di lingkungan Next.js
// @ts-ignore // (Opsional: Tambahkan ignore jika compiler masih rewel)
type ReadonlyRequestCookies = any; 

export async function createClient() {
  // Gunakan 'cookies()' yang diimpor, lalu cast secara eksplisit (seperti yang sudah kita lakukan)
  const cookieStore = cookies() as ReadonlyRequestCookies 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)
        },
        set(name, value, options) {
            cookieStore.set(name, value, options)
        },
        remove(name, options) {
            cookieStore.set(name, '', options)
        },
      },
    }
  )
}

