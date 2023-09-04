import { stateVariables, type StateVariableInsert, type StateVariableUpdate } from "$lib/classes/stateVariables"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import type { PageLoadEvent } from "./$types"
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import type { Database } from "$lib/types/supabase"
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit"
import { redirect } from "@sveltejs/kit"

/* **FUTURE:** The subscription stays open in the background even after navigating away.
    This isn't ideal but it's probably better than rerunning the DB query in +page.server
    every time the page is navigated to.
*/
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
            if (eventType === 'UPDATE') stateVariables.updateData(data as StateVariableUpdate)
            if (eventType === 'INSERT') stateVariables.addFromDB(data as StateVariableInsert)
            // don't delete proxies based on DB subscription, 
            // prefer to resolve the error
            // when the UPDATE query is sent to the DB
            // **FUTURE:** Push toast notification to page
        }
    ).subscribe()
}

export const load = ({fetch, data, depends}: PageLoadEvent) => {
    depends('supabase:auth')

    const { user = null } = data.session ?? {}
    if (!user) throw redirect(303, '/')

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    })

    stateVariables.init(data.stateVarRows)
    subscribeToVars(supabase, user)

    return data
}