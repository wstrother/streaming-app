import { writable, type Writable, derived, type Readable } from 'svelte/store'
import { ProxyDBRow, ProxyDBQuery } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate } from './dbProxy'

type StateVariableRow = DatabaseRow<'state_variables'>
type StateVariableUpdate = DatabaseUpdate<'state_variables'>

export class StateVariableCls extends ProxyDBRow<'state_variables'> {
    varMap: VariableMap

    constructor(stateVar: StateVariableRow, varMap: VariableMap) {
        super(stateVar)
        this.varMap = varMap
    }

    get value(): string | null {
        return this.data.value
    }

    get key(): string {
        return this.data.key
    }
}

export class VariableMap extends ProxyDBQuery<'state_variables', StateVariableCls> {
    _store: Writable<StateVariableCls[]>

    constructor() {
        super()
        this._store = writable(this.rows)
    }

    setVars(vars: StateVariableRow[]) {
        this.rows = vars.map(r=>new StateVariableCls(r, this))
        this.broadcastChanges()
    }

    updateVar(node: StateVariableUpdate, id: number) {
        super.updateRow(node, id)
        this.broadcastChanges()
    }

    broadcastChanges() {
        this._store.set(this.rows)
    }
}

const varMap = new VariableMap()

function getVarById(vars: StateVariableCls[], id: number | null): string | null {
    const value = vars.filter(v => v.id===id)[0].value
    if (value === undefined) return null
    return value
}

function getVarByKey(vars: StateVariableCls[], key: string) {
    const value = vars.filter(v => v.key===key)[0].value
    if (value === undefined) return null
    return value
}

export type VarValue = string | null | undefined
export type VarStore = Readable<VarValue>

export function getVarStore(id: number|null): Readable<string | null | undefined> {
    if (id) { return derived(varMap._store, vars => getVarById(vars, id)) }
    else return writable('')
}

export const stateVariables = {
    set: varMap._store.set, 
    update: varMap._store.update, 
    subscribe: varMap._store.subscribe,

    setVars: (vars: StateVariableRow[]) => varMap.setVars(vars),

    updateVar: (stateVar: StateVariableUpdate) => {
        varMap.updateVar(stateVar, stateVar?.id as number)
    },

    getVarById,
    getVarByKey
}