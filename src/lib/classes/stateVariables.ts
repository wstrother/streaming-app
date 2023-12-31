import { get, writable } from 'svelte/store'
import { ProxyDBRow, initProxies, updateProxy } from './dbProxy'
import type { DatabaseInsert, DatabaseRow, DatabaseTableName, DatabaseUpdate, StateVarTypesLiterals, StateVarValue } from './dbProxy'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export type StateVariableRow = DatabaseRow<'state_variables'>
export type StateVariableUpdate = DatabaseUpdate<'state_variables'>
export type StateVariableInsert = DatabaseInsert<'state_variables'>

let CLIENT_ID = -1

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

    static getAsInsert(
        data: StateVariableInsert, broadcast: Function, client: boolean=true
        ): StateVariableProxy {

            const defaults: DatabaseRow<'state_variables'> = {
                created_at:null,
                id:CLIENT_ID,
                key:"",
                type:"string",
                user_id:"",
                value: ""
            }
            CLIENT_ID -= 1

            return new StateVariableProxy(
                {...defaults, ...data}, 
                broadcast, 
                client
            )
    }
}

const varStore = writable<StateVariableProxy[]>([])
type VarArray = StateVariableProxy[]

/* 
    **FUTURE**: Figure out a way to refactor so passing vars array to mutations not needed
*/
export const stateVariables = {
    subscribe: varStore.subscribe, 
    set: varStore.set, 
    update: varStore.update,

    updateData: (vars: VarArray, update: StateVariableUpdate) => {
        updateProxy<'state_variables', StateVariableProxy>(
            vars, update, 'state_variables'
        )
    },

    init: (vars: StateVariableRow[]) => {
        // **FUTURE:** implement proper caching
        // if (!varStoreInitialized) {
            initProxies<'state_variables', StateVariableRow, StateVariableProxy>(
                vars, varStore.set, StateVariableProxy
            )
            // varStoreInitialized = true
        // }
    },

    resetStore: () => {
        varStore.set([])
        // varStoreInitialized = false
    },

    getValueByID: (vars: StateVariableProxy[], id: number | null): StateVarValue => {
        const stateVariable = vars.filter(v => v.id===id)[0]
        if (stateVariable === undefined) return null
        return stateVariable.value
    }, 
    
    getValueByKey: (vars: StateVariableProxy[], key: string): StateVarValue => {
        const stateVariable = vars.filter(v => v.key===key)[0]?.value
        if (stateVariable === undefined) return null
        return stateVariable
    },

    add: (vars: StateVariableProxy[], data: StateVariableInsert) => {
        const stateVar = StateVariableProxy.getAsInsert(
            data, () => varStore.set(vars))
        vars.push(stateVar)
        varStore.set(vars)
    },

    addFromDB: (vars: VarArray, data: StateVariableInsert) => {
        vars.push(StateVariableProxy.getAsInsert(
            data, 
            () => varStore.set(vars),
            false   // client = false
        ))
        varStore.set(vars)
    },

    addToDB: async (supabase: SupabaseClient, data: StateVariableInsert) => {
        return await StateVariableProxy.addToDB(supabase, 'state_variables', data)
    },

    delete: (vars: StateVariableProxy[], stateVariable: StateVariableProxy) => {
        vars.splice(vars.indexOf(stateVariable), 1)
        varStore.set(vars)
    },

    getProxyByID: (vars: VarArray, varID: Number): StateVariableProxy => {
        return vars.filter(v => v.id === varID)[0]
    },

    getProxyByKey: (vars: StateVariableProxy[], key: String): StateVariableProxy => {
        return vars.filter(v => v.key === key)[0]
    },

    subscribeToDB: (supabase: SupabaseClient, user: User) => {
        supabase.channel('state_vars_realtime').on('postgres_changes', {
                event: '*', 
                schema: 'public', 
                table: 'state_variables', 
                filter:`user_id=eq.${user.id}`},
    
            payload => {
                const { eventType } = payload
                const data = payload?.new ?? null
    
                if (!data || eventType === 'DELETE') return
                if (eventType === 'UPDATE') stateVariables.updateData(get(varStore), data as StateVariableUpdate)
                if (eventType === 'INSERT') stateVariables.addFromDB(get(varStore), data as StateVariableInsert)
                // don't delete proxies based on DB subscription, 
                // prefer to resolve the error
                // when the UPDATE query is sent to the DB
                // **FUTURE:** Push toast notification to page
            }
        ).subscribe()
    }
}

export type StateVarStore = typeof stateVariables