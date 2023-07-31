import { readable, type Readable } from "svelte/store";
import { supabase } from "$lib/supabaseClient";

import type { Database } from '$lib/types/supabase';

type StateVariable = Database['public']['Tables']['state_variables']['Row']
type StateVariableArray = Array<StateVariable>

const getStateVars = async (): Promise<StateVariableArray> => {
    let {data, error} = await supabase.from('state_variables').select(`*`)

    if (error) {
        console.log(error)
    } else if (data) {
        console.log(data)
        return data
    }
    return []
}

const getStateVarStore = async (): Promise<Readable<StateVariableArray>> => {
    const _stateVars: StateVariableArray = await getStateVars()
    // console.log(_stateVars)

    const stateVarsStore = readable<StateVariableArray>(_stateVars, 
        (set) => {
        const subscription = supabase.channel('any').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'state_variables'
            },
                async (payload) => {
                    if (payload.new) {
                        const _newStateVars: StateVariableArray = await getStateVars()
                        set(_newStateVars)
                    }
                }
            ).subscribe()
        
            return () => {subscription.unsubscribe()}
    })

    return stateVarsStore
}

export const stateVariables = await getStateVarStore()