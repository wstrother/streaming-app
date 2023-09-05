import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import type { Database } from "$lib/types/supabase"
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit"
import { redirect } from "@sveltejs/kit"
import { layoutNodes } from "$lib/classes/layoutNodes"
import { stateVariables } from "$lib/classes/stateVariables.js"


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

    layoutNodes.init(data.layoutNodeRows)
    layoutNodes.subscribeToDB(supabase, user)

    stateVariables.init(data.stateVariableRows)
    stateVariables.subscribeToDB(supabase, user)

    return data
}