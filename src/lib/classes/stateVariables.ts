import { get, writable } from 'svelte/store'
import { ProxyDBRow, initProxies, updateProxy } from './dbProxy'
import type { DatabaseInsert, DatabaseRow, DatabaseTableName, DatabaseUpdate, StateVarTypesLiterals, StateVarValue } from './dbProxy'
import type { SupabaseClient } from '@supabase/supabase-js'

export type StateVariableRow = DatabaseRow<'state_variables'>
export type StateVariableUpdate = DatabaseUpdate<'state_variables'>
export type StateVariableInsert = DatabaseInsert<'state_variables'>

export class StateVariableProxy extends ProxyDBRow<'state_variables'> {
    _table = "state_variables" as const
    
    get value(): StateVarValue {
        const stringValue = this.getColumn('value')

        if (stringValue === null) return null
        if (this.type === 'string') return stringValue

        const numValue = Number(stringValue)

        if (this.type === 'number') return numValue
        if (this.type === 'boolean') {
            if (stringValue?.toLowerCase() === 'true') return true
            else return Boolean(numValue)
        }

        throw new Error(
            `Bad "type" value on StateVariableProxy with id ${this.id}: '${stringValue}'`
        )
    }

    get key(): string {
        return this.getColumn('key')
    }

    get type(): StateVarTypesLiterals {
        return this.getColumn('type')
    }

    // async saveChangesToDB(supabase: SupabaseClient) {
    //     await super.saveChangesToDB('state_variables', supabase)
    // }

    async deleteFromDB() {
        await super.deleteFromDB('state_variables')
    }

    static getAsInsert(data: DatabaseInsert<'state_variables'>, broadcast: Function, client: boolean=true): StateVariableProxy {
        const defaults: DatabaseRow<'state_variables'> = {
            created_at:null,
            id:0,
            key:"",
            type:"string",
            user_id:"",
            value: ""
        }
        return new StateVariableProxy({...defaults, ...data}, broadcast, client)
    }
}

const varStore = writable<StateVariableProxy[]>([])
let varStoreInitialized = false

// move these later
function getValueByID(vars: StateVariableProxy[], id: number | null): StateVarValue {
    const stateVariable = vars.filter(v => v.id===id)[0]
    if (stateVariable === undefined) return null
    return stateVariable.value
}

function getValueByKey(vars: StateVariableProxy[], key: string): StateVarValue {
    const stateVariable = vars.filter(v => v.key===key)[0]?.value
    if (stateVariable === undefined) return null
    return stateVariable
}

export const stateVariables = {
    subscribe: varStore.subscribe, 
    set: varStore.set, 
    update: varStore.update,

    updateData: (update: StateVariableUpdate) => {
        const svArray = get(varStore)
        updateProxy<'state_variables', StateVariableProxy>(
            svArray, update, 'state_variables'
        )
    },

    init: (vars: StateVariableRow[]) => {
        if (!varStoreInitialized) {
            initProxies<'state_variables', StateVariableRow, StateVariableProxy>(
                vars, varStore.set, StateVariableProxy
            )
            varStoreInitialized = true
        }
    },

    resetStore: () => {
        varStore.set([])
        varStoreInitialized = false
    },

    getValueByID, getValueByKey,

    add: (vars: StateVariableProxy[], key: string, user_id: string, value: string) => {
        const stateVar = StateVariableProxy.getAsInsert({key, user_id, value}, () => varStore.set(vars))
        vars.push(stateVar)
        varStore.set(vars)
    },

    addFromDB: (data: StateVariableInsert) => {
        const varArray = get(varStore)
        varArray.push(StateVariableProxy.getAsInsert(
            data, 
            () => varStore.set(varArray),   // I don't understand how this isn't a bug
            false   // client = false
        ))
        varStore.set(varArray)
    },

    delete: (vars: StateVariableProxy[], stateVariable: StateVariableProxy) => {
        vars.splice(vars.indexOf(stateVariable), 1)
        varStore.set(vars)
    },

    getProxyByID: (vars: StateVariableProxy[], varID: Number): StateVariableProxy => {
        return vars.filter(v => v.id === varID)[0]
    },

    getProxyByKey: (vars: StateVariableProxy[], key: String): StateVariableProxy => {
        return vars.filter(v => v.key === key)[0]
    }
}

export type StateVarStore = typeof stateVariables