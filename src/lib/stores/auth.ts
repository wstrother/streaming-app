import { supabase } from "$lib/stores/supabaseClient";
import { writable } from "svelte/store";


export const user: any = writable();

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

user.login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    // if ( error ) {
    //     console.log('error')
    // } else {
    //     console.log(data)
    // }
}

user.logout = async () => {
    const { error } = await supabase.auth.signOut()

    // if ( error ) {
    //     console.log(error)
    // }
}