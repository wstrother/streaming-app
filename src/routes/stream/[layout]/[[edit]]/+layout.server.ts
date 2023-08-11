import { error as routeError } from '@sveltejs/kit'
import { supabase } from "$lib/supabaseClient"
import type { DatabaseRow } from '$lib/classes/dbProxy'


const getLayoutData = async (layoutName: string): Promise<DatabaseRow<'layouts'>> => {
    let {data, error} = await supabase.from('layouts')
        .select('*').eq('name', layoutName).single()

    if (error) {
        throw new Error(error.message)
    } else if (!data) {
        throw new Error(`DB error: No layout found with name ${layoutName}`)
    }
    return data
}

const getLayoutNodes = async (layoutID: number): Promise<DatabaseRow<'layout_nodes'>[]> => {
    let {data, error} = await supabase.from('layout_nodes')
        .select(`*`).eq('layout_id', layoutID)

    if (error) {
        throw new Error(error.message)
    } else if (data) {
        return data
    }
    return []
}

const getStateVariables = async (): Promise<DatabaseRow<'state_variables'>[]> => {
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