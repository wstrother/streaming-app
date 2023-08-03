import type { Database } from '$lib/types/supabase';

type StateVariableDB = Database['public']['Tables']['state_variables']['Row']
type StateVariableDBArray = Array<StateVariableDB>
type StateVariableValue = string | null | number

class VariableMap {
    _values: Map<string, StateVariableValue> = new Map()
    _ids: Map<number, string> = new Map()
    
    constructor(stateVars: StateVariableDBArray) {
        stateVars.forEach((v) => { this.addVar(v) })
    }

    addVar(stateVar: StateVariableDB) {
        this._values.set(stateVar.key, stateVar.value)
    }

    getVar(key: string): StateVariableValue {
        const value = this._values.get(key)
        if (value === undefined) throw Error(`Variable access error: No state variable found with key: '${key}'`)

        return value
    }

    getVarByID(id: number): StateVariableValue {
        const key = this._ids.get(id)
        if (key === undefined) throw Error(`Variable access error: No state variable found with id: '${id}'`)
        
        return this.getVar(key)
    }
}