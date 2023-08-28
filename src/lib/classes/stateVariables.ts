import { writable, derived, type Readable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate, StateVarTypesLiterals, StateVarValue } from './dbProxy'

export type StateVariableRow = DatabaseRow<'state_variables'>
export type StateVariableUpdate = DatabaseUpdate<'state_variables'>

export class StateVariableProxy extends ProxyDBRow<'state_variables'> {
    constructor(data: StateVariableRow, broadcast: Function | null = null) {
        super(data, broadcast)
    }

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

        throw new Error(`Bad "type" value on StateVariableProxy with id ${this.id}: '${stringValue}'`)
    }

    get key(): string {
        return this.getColumn('key')
    }

    get type(): StateVarTypesLiterals {
        return this.getColumn('type')
    }

    async saveChangesToDB() {
        await super.saveChangesToDB('state_variables')
    }
}
    
const varStore = writable<StateVariableProxy[]>([])


function getVarByID(vars: StateVariableProxy[], id: number | null): StateVarValue {
    const stateVariable = vars.filter(v => v.id===id)[0]
    if (stateVariable === undefined) return null
    return stateVariable.value
}

function getVarByKey(vars: StateVariableProxy[], key: string): StateVarValue {
    const stateVariable = vars.filter(v => v.key===key)[0]?.value
    if (stateVariable === undefined) return null
    return stateVariable
}

function getVarStore(id: number|null): Readable<StateVarValue> {
    if (id) { return derived(varStore, (vars) => {
        return getVarByID(vars, id)
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

    getVarByID, getVarByKey, getVarStore
}