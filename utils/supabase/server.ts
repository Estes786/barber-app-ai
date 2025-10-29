// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies, ReadonlyRequestCookies } from 'next/headers'

export async function createClient() {
  // --- PERBAIKAN: GUNAKAN AS ReadonlyRequestCookies ---
  const cookieStore = cookies() as ReadonlyRequestCookies
  // ----------------------------------------------------

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Sekarang 'cookieStore.get' tidak akan error
          return cookieStore.get(name)
        },
        set(name, value, options) {
            // Karena ini di Server Component, Supabase SSR hanya
            // menggunakan get/getAll/setAll/remove.
            // set dan remove ini mungkin tidak digunakan
            // tetapi kita biarkan untuk kelengkapan Supabase SSR.
            cookieStore.set(name, value, options)
        },
        remove(name, options) {
            cookieStore.set(name, '', options)
        },
      },
    }
  )
}

