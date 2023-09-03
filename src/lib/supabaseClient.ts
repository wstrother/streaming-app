import { createClient, type AuthChangeEvent, type Session, type User } from "@supabase/supabase-js"
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"
import type { Database } from '$lib/types/supabase'
import { writable, type Writable } from "svelte/store"

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

export const userMeta: Writable<{uid?: string}> = writable({})

supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session|null) => {
    if (session && session.user) {
        if (event !== 'SIGNED_OUT') userMeta.set({uid: session.user.id})
        else userMeta.set({})
    }
})