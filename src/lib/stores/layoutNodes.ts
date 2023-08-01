import { readable, type Readable } from "svelte/store";
import { supabase } from "$lib/supabaseClient";

import type { Database } from '$lib/types/supabase';

export type LayoutNode = Database['public']['Tables']['layout_nodes']['Row']
export type LayoutNodeArray = Array<LayoutNode>

const getLayoutNodes = async (): Promise<LayoutNodeArray> => {
    let {data, error} = await supabase.from('layout_nodes').select(`*`)

    if (error) {
        console.log(error)
    } else if (data) {
        console.log(data)
        return data
    }
    return []
}

const getLayoutNodeStore = async (): Promise<Readable<LayoutNodeArray>> => {
    const _layoutNodes: LayoutNodeArray = await getLayoutNodes()

    const layoutNodeStore = readable<LayoutNodeArray>(_layoutNodes,
        (set) => {
        const subscription = supabase.channel('layouts_realtime').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'layout_nodes'
            },
                async (payload) => {
                    console.log('update to layout_nodes detected')
                    console.log(payload)
                    if (payload.new) {
                        const _newLayoutNodes: LayoutNodeArray = await getLayoutNodes()
                        set(_newLayoutNodes)
                    }
                }
            ).subscribe()

            return () => {subscription.unsubscribe()}
    })

    return layoutNodeStore
}

export const layoutNodes = await getLayoutNodeStore()