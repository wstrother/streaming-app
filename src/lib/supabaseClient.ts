import { createClient, type AuthChangeEvent, type Session, type User } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL, PUBLIC_ADMIN_PASSWORD, PUBLIC_ADMIN_EMAIL } from "$env/static/public";
import type { Database } from '$lib/types/supabase';
import { writable, type Writable } from "svelte/store";

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

// dev mode hack
export const devLogin = async (): Promise<User> => {
    if (import.meta.env.DEV) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: PUBLIC_ADMIN_EMAIL,
            password: PUBLIC_ADMIN_PASSWORD
        })
        
        if (error) throw new Error(error.message)

        if (data.user === undefined) throw new Error('Dev login failed')
        return data.user
    }
    throw new Error('Auth not implemented yet')
}

export const userMeta: Writable<{uid?: string}> = writable({})

supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session|null) => {
    if (session && session.user) {
        if (event !== 'SIGNED_OUT') userMeta.set({uid: session.user.id})
        else userMeta.set({})
    }
})