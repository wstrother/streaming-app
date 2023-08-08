import { supabase } from "$lib/supabaseClient"

export async function load() {
    const {data, error} = await supabase.from('layouts').select('name')

    if (error) {
        throw Error(error.message)
    }

    return {
        layoutNames: data.map(l=>l.name)
    }
}