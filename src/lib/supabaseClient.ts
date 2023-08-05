import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL, PUBLIC_ADMIN_PASSWORD, PUBLIC_ADMIN_EMAIL } from "$env/static/public";
import type { Database } from '$lib/types/supabase';

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

// dev mode hack
if (import.meta.env.DEV) {
    supabase.auth.signInWithPassword({
        email: PUBLIC_ADMIN_EMAIL,
        password: PUBLIC_ADMIN_PASSWORD
    })
}