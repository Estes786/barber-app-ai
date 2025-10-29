// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Kita gunakan '!' untuk memastikan nilai tidak null, karena kita tahu
// env var sudah ada di Vercel
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

