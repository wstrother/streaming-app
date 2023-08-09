import type { Database } from '$lib/types/supabase';
import { writable, derived, type Writable, type Readable } from 'svelte/store';

export type StateVariableDB = Database['public']['Tables']['state_variables']['Row']
export type StateVariableDBArray = Array<StateVariableDB>
export type StateVariableValue = string | null | number

export class VariableMap {
    _values: Map<string, StateVariableValue> = new Map()
    _ids: Map<number, string> = new Map()
    // _store: Writable<Map<string, StateVariableValue>>
    
    // constructor() {
        // this._store = writable(this._values)
    // }

    setVariables(stateVars: StateVariableDBArray) {
        stateVars.forEach((v) => { this.setVar(v) })
    }

    setVar(stateVar: StateVariableDB) {
        this._values.set(stateVar.key, stateVar.value)
        this._ids.set(stateVar.id, stateVar.key)
        // this._store.set(this._values)
    }

    getVarByKey(key: string): StateVariableValue {
        const value = this._values.get(key)
        if (value === undefined) throw Error(`Variable access error: No state variable found with key: '${key}'`)

        return value
    }

    getVarByID(id: number): StateVariableValue {
        const key = this._ids.get(id)
        if (key === undefined) throw Error(`Variable access error: No state variable found with id: '${id}'`)

        return this.getVarByKey(key)
    }
}

const varMap = new VariableMap()
const varStore = writable(varMap)

export type VarSubscription = Writable<StateVariableValue>|Readable<StateVariableValue>
export function subscribeVariable(id: number|null): VarSubscription {
    if (id) return derived(varStore, vm=>vm.getVarByID(id))

    return writable('')
}

export const stateVariables = {
    set: varStore.set, 
    update: varStore.update, 
    subscribe: varStore.subscribe,
    setVariables: (vars: StateVariableDBArray) => varMap.setVariables(vars),
    setVar: (v: StateVariableDB) => {
        varMap.setVar(v)
        varStore.set(varMap)
    },
    getVar: (find: number|string) => {
        if (typeof(find) === 'string') return varMap.getVarByKey(find)
        if (typeof(find) === 'number') return varMap.getVarByID(find)
    }
}