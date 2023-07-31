import { writable } from "svelte/store";
import { supabase } from "$lib/supabaseClient";

import type { Database } from '$lib/types/supabase';

type LayoutNode = Database['public']['Tables']['layout_nodes']['Row']

export const layoutNodes = writable<Array<LayoutNode>>([]);

const getLayoutNodes = async () => {
    let {data, error} = await supabase.from('layout_nodes').select(`*`)
    if (error) {
        console.log(error)
    } else if (data) {
        console.log(data)
        layoutNodes.set(data)
    }
}
getLayoutNodes()
