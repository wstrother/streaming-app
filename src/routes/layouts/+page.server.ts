import type { SupabaseClient, User } from '@supabase/supabase-js'
import { redirect, error as routeError, type ServerLoadEvent } from '@sveltejs/kit'

const getLayouts = async (supabase: SupabaseClient, user: User
    ): Promise<{name: string}[]> => {
        let { data, error } = await supabase.from('layouts').select('name')
            .eq('user_id', user.id)
        
        if (error) throw new Error(error.message)

        return data ?? []
}

export async function load({depends, locals: { supabase, getSession }}:ServerLoadEvent) {
    depends('supabase:auth')

    const { user = null } = await getSession() ?? {}
    if (!user) {
        throw redirect(303, '/')
    }
    else {    
        return {
            layoutNames: (await getLayouts(supabase, user)).map(l => l.name)
        }
    }
}
