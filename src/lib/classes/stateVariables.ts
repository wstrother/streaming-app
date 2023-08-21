import { writable, derived, type Readable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate, stateVarTypes } from './dbProxy'

export type StateVariableRow = DatabaseRow<'state_variables'>
export type StateVariableUpdate = DatabaseUpdate<'state_variables'>

export class StateVariableProxy extends ProxyDBRow<'state_variables'> {
    get value(): string | null {
        return this.getColumn('value')
    }

    get key(): string {
        return this.getColumn('key')
    }

    get type(): stateVarTypes {
        return this.getColumn('type') as stateVarTypes
    }

    async saveChangesToDB() {
        await super.saveChangesToDB('state_variables')
    }
}
    
const varStore = writable<StateVariableProxy[]>([])


function getVarById(vars: StateVariableProxy[], id: number | null): StateVariableProxy | null {
    const value = vars.filter(v => v.id===id)[0]
    if (value === undefined) return null
    return value
}

function getVarByKey(vars: StateVariableProxy[], key: string): string|null {
    const value = vars.filter(v => v.key===key)[0]?.value
    if (value === undefined) return null
    return value
}

export type VarValue = string | null | undefined
export type VarStore = Readable<VarValue>

function getVarStore(id: number|null): Readable<VarValue> {
    if (id) { return derived(varStore, (vars) => {
        return getVarById(vars, id)?.value
    })
    } else return writable('')
}

export const stateVariables = {
    subscribe: varStore.subscribe, 
    set: varStore.set, 
    update: varStore.update,

    updateVar: (vars: StateVariableProxy[], update: StateVariableUpdate) => {
        updateProxy<'state_variables', StateVariableProxy>(
            vars, update, 'state_variables'
        )
    },

    getVars: (vars: StateVariableRow[]): StateVariableProxy[] => {
        return getProxies<'state_variables', StateVariableRow, StateVariableProxy>(
            vars, varStore.set, StateVariableProxy
        )
    },

    getVarById, getVarByKey, getVarStore
}