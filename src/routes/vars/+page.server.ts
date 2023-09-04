import type { DatabaseRow } from '$lib/classes/dbProxy'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'


const getStateVariables = async (supabase: SupabaseClient, user: User): 
    Promise<DatabaseRow<'state_variables'>[]> => {
        let { data, error } = await supabase.from('state_variables').select(`*`)
            .eq('user_id', user.id)

        if (error) throw new Error(error.message)
        
        return data ?? []
}

export async function load({depends, locals: { supabase, getSession }}) {
    depends('supabase:auth')

    const session = await getSession()
    const { user = null } = session ?? {}
    if (!user) {
        throw redirect(303, '/')
    }

    // data cache this?
    return {
        stateVarRows: await getStateVariables(supabase, user),
        session
    }
}