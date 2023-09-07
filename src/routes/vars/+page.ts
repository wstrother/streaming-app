import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import type { Database } from "$lib/types/supabase"
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit"
import { redirect } from "@sveltejs/kit"

import { stateVariables } from "$lib/classes/stateVariables"

export const load = ({fetch, data, depends}) => {
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
    stateVariables.subscribeToDB(supabase, user)

    return data
}