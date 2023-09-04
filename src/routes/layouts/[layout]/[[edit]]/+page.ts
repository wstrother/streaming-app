import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import type { Database } from "$lib/types/supabase"
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit"
import { redirect } from "@sveltejs/kit"
import type { PageLoadEvent } from "../../../vars/$types"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { layoutNodes, type LayoutNodeInsert, type LayoutNodeUpdate } from "$lib/classes/layoutNodes"

const subscribeToVars = (supabase: SupabaseClient, user: User) => {
    supabase.channel('state_vars_realtime').on('postgres_changes', {
            event: '*', 
            schema: 'public', 
            table: 'state_variables', 
            filter:`user_id=eq.${user.id}`},

        payload => {
            const { eventType } = payload
            const data = payload?.new ?? null

            if (!data || eventType === 'DELETE') return
            if (eventType === 'UPDATE') layoutNodes.updateData(data as LayoutNodeUpdate)
            if (eventType === 'INSERT') layoutNodes.addFromDB(data as LayoutNodeInsert)
            // don't delete proxies based on DB subscription, 
            // prefer to resolve the error
            // when the UPDATE query is sent to the DB
            // **FUTURE:** Push toast notification to page
        }
    ).subscribe()
}

export const load = ({fetch, data, depends}) => {
    depends('supabase:auth')

    console.log('hello')
    debugger
    const { user = null } = data.session ?? {}
    if (!user) throw redirect(303, '/')

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    })

    layoutNodes.init(data.layoutNodeRows)

    return data
}