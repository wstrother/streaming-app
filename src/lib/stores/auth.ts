import { supabase } from "$lib/supabaseClient";
import { writable } from "svelte/store";


export const user = writable();

supabase.auth.onAuthStateChange(async (event, session) => {
    // console.log(event)
    if (session) {
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (error) console.log(error);
        if (data) user.set(data);
    }
    else user.set(null);
});
