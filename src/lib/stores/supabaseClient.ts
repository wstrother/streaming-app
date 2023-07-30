import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Database } from '../../../types/supabase';

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

export const get_vars = async () => {
    let query  = await supabase
        .from('state_variables')
        .select('*')
    
    console.log(query)
}
