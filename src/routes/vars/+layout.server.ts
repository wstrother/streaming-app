import { error as routeError } from '@sveltejs/kit'
import { supabase } from "$lib/supabaseClient"
import type { DatabaseRow } from '$lib/classes/dbProxy'


const getStateVariables = async (): Promise<DatabaseRow<'state_variables'>[]> => {
    let {data, error} = await supabase.from('state_variables').select(`*`)

    if (error) {
        throw new Error(error.message)
    } else if (data) {
        return data
    }
    return []
}

export async function load() {
    try {
        const stateVariables = await getStateVariables()

        return {
            stateVariables
        }
    }
    
     catch {
        throw routeError(404, 'Layout not found')
    }
}