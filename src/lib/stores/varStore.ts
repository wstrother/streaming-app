import { readable, type Readable } from "svelte/store"
import { supabase } from "$lib/supabaseClient"
import { VariableMap } from "$lib/classes/variableMap"

import type { Database } from '$lib/types/supabase'

export type StateVariableDB = Database['public']['Tables']['state_variables']['Row']
export type StateVariableDBArray = Array<StateVariableDB>

const getStateVars = async (): Promise<StateVariableDBArray> => {
    let {data, error} = await supabase.from('state_variables').select(`*`)

    if (error) {
        console.log(error)
    } else if (data) {
        return data
    }
    return []
}

const getStateVarStore = async (): Promise<Readable<VariableMap>> => {
    const _stateVars: StateVariableDBArray = await getStateVars()
    const varMap: VariableMap = new VariableMap(_stateVars)

    const stateVarsStore = readable<VariableMap>(varMap, 
        (set) => {
        const subscription = supabase.channel('state_vars_realtime').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'state_variables'
        },
            (payload) => {
                if (payload.new) {
                    varMap.setVar(payload.new as StateVariableDB)
                    set(varMap)
                }
            }
        ).subscribe()
    
        return () => {subscription.unsubscribe()}
    })

    return stateVarsStore
}

export const stateVariableStore = await getStateVarStore()