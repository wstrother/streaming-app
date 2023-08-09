import { error as routeError } from '@sveltejs/kit'
import { supabase } from "$lib/supabaseClient"
import type { Database } from '$lib/types/supabase'

type LayoutNodeDB = Database['public']['Tables']['layout_nodes']['Row']
type LayoutNodeDBArray = Array<LayoutNodeDB>
type LayoutDB = Database['public']['Tables']['layouts']['Row']
type StateVariableDB = Database['public']['Tables']['state_variables']['Row']
type StateVariableDBArray = Array<StateVariableDB>


const getLayoutData = async (layoutName: string): Promise<LayoutDB> => {
    let {data, error} = await supabase.from('layouts')
        .select('*').eq('name', layoutName).single()

    if (error) {
        throw new Error(error.message)
    } else if (!data) {
        throw new Error(`DB error: No layout found with name ${layoutName}`)
    }
    return data
}

const getLayoutNodes = async (layoutID: number): Promise<LayoutNodeDBArray> => {
    let {data, error} = await supabase.from('layout_nodes')
        .select(`*`).eq('layout_id', layoutID)

    if (error) {
        throw new Error(error.message)
    } else if (data) {
        return data
    }
    return []
}

const getStateVariables = async (): Promise<StateVariableDBArray> => {
    let {data, error} = await supabase.from('state_variables').select(`*`)

    if (error) {
        throw new Error(error.message)
    } else if (data) {
        return data
    }
    return []
}

export async function load({ params }) {
    if (params.edit && params.edit !== 'edit') {
        throw routeError(404, 'Layout not found')
    }

    try {
        const layoutData = await getLayoutData(params.layout)
        const nodes = await getLayoutNodes(layoutData.id)
        const stateVariables = await getStateVariables()

        return {
            edit: params.edit === 'edit',
            layoutData,
            nodes,
            stateVariables
        }
    }
    
     catch {
        throw routeError(404, 'Layout not found')
    }
}