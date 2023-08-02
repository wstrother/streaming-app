import { readable, type Readable } from "svelte/store";
import { supabase } from "$lib/supabaseClient";
import { LayoutTree } from "$lib/classes/layoutTree";

import type { Database } from '$lib/types/supabase';

export type LayoutNode = Database['public']['Tables']['layout_nodes']['Row']
export type LayoutNodeArray = Array<LayoutNode>

const getLayoutNodes = async (): Promise<LayoutNodeArray> => {
    let {data, error} = await supabase.from('layout_nodes').select(`*`)

    if (error) {
        console.log(error)
    } else if (data) {
        return data
    }
    return []
}

const getLayoutNodeStore = async (): Promise<Readable<LayoutTree>> => {
    const _layoutNodes: LayoutNodeArray = await getLayoutNodes()
    const layoutTree: LayoutTree = new LayoutTree(_layoutNodes)

    const layoutNodeStore = readable<LayoutTree>(layoutTree,
        (set) => {
        const subscription = supabase.channel('layouts_realtime').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'layout_nodes'
            },
            (payload) => {
                if (payload.new) {
                    layoutTree.updateNode(payload.new as LayoutNode)
                    set(layoutTree)
                }
            }
        ).subscribe()

        return () => {subscription.unsubscribe()}
    })

    return layoutNodeStore
}

export const layoutTree = await getLayoutNodeStore()