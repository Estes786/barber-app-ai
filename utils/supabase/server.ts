// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // UBAH DARI getAll() MENJADI get(name)
          return cookieStore.get(name)
        },
        set(name, value, options) {
            cookieStore.set(name, value, options)
        },
        remove(name, options) {
            cookieStore.set(name, '', options) // set value empty to remove
        },
      },
    }
  )
}

