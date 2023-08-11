import { writable, type Writable, derived, type Readable } from 'svelte/store'
import { ProxyDBRow } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate } from './dbProxy'

export type StateVariableRow = DatabaseRow<'state_variables'>
export type StateVariableUpdate = DatabaseUpdate<'state_variables'>

export class StateVariableCls extends ProxyDBRow<'state_variables'> {
    constructor(stateVar: StateVariableRow, broadcast: Function | null) {
        super(stateVar, broadcast)
    }

    get value(): string | null {
        return this.getColumn('value')
    }

    get key(): string {
        return this.getColumn('key')
    }
}

// export class VariableMap extends ProxyDBQuery<'state_variables', StateVariableCls> {
//     _store: Writable<StateVariableCls[]>

//     constructor() {
//         super()
//         this._store = writable(this.rows)
//     }


//     broadcastChanges() {
    //         this._store.set(this.rows)
    //     }
    // }
    
    // const varMap = new VariableMap()
    
const varStore = writable<StateVariableCls[]>([])

export function getVars(vars: StateVariableRow[]) {
    const varsCls: StateVariableCls[] = []
    const broadcast = () => {
        varStore.set(varsCls)
    }

    vars.forEach(v => {
        varsCls.push(
            new StateVariableCls(v, broadcast)
        )
    })

    return varsCls
}

export function updateVar(vars: StateVariableCls[], update: StateVariableUpdate) {
    if (!update.id) throw Error('No ID passed in update to state_variables')

    const index = vars.findIndex(v=>v.id===update.id)
    const sv = vars[index]

    if (!sv) throw Error(`No variable found with ID:${update.id}`)

    sv.update(update)
    sv.saveChangesToProxy()
}

export function getVarById(vars: StateVariableCls[], id: number | null): string | null {
    const value = vars.filter(v => v.id===id)[0].value
    if (value === undefined) return null
    return value
}

export function getVarByKey(vars: StateVariableCls[], key: string) {
    const value = vars.filter(v => v.key===key)[0].value
    if (value === undefined) return null
    return value
}

export type VarValue = string | null | undefined
export type VarStore = Readable<VarValue>

export function getVarStore(id: number|null): Readable<VarValue> {
    if (id) { return derived(varStore, (vars) => {
        return getVarById(vars, id)
    })
    } else return writable('')
}

export const stateVariables = {
    subscribe: varStore.subscribe, 
    set: varStore.set, 
    update: varStore.update
}