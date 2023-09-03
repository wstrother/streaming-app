import { error as routeError } from '@sveltejs/kit'
import { devLogin, supabase } from "$lib/supabaseClient"
import { PUBLIC_SUPABASE_URL } from '$env/static/public'

const getLayouts = async (user_id: string): Promise<{name: string}[]> => {
    let { data, error } = await supabase.from('layouts').select('name')
        .eq('user_id', user_id)
    
    if (error) throw new Error(error.message)

    return data ?? []
}


export async function load() {
    try {
        const user = await devLogin()
        const layoutNames = (await getLayouts(user.id)).map(l => l.name)

        return { layoutNames }
    }
    
     catch {
        throw routeError(404, 'Layout not found')
    }
}