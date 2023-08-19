import { supabase } from "$lib/supabaseClient"
import type { Database } from "$lib/types/supabase"

export type DatabaseTableName = keyof Database['public']['Tables']
export type DatabaseTable = Database['public']['Tables']
export type DatabaseRow<T extends DatabaseTableName> = DatabaseTable[T]['Row']
export type DatabaseUpdate<T extends DatabaseTableName> = DatabaseTable[T]['Update']
export type DatabaseColumnName<T extends DatabaseTableName> = T extends DatabaseTableName ? keyof DatabaseRow<T> & keyof DatabaseUpdate<T> : never
export type DatabaseColumnValue<T extends DatabaseTableName, C extends DatabaseColumnName<T>> = DatabaseRow<T>[C]


export class ProxyDBRow<T extends DatabaseTableName> {
    data: DatabaseRow<T>
    changes: DatabaseUpdate<T>
    _broadcast: Function | null

    constructor(data: DatabaseRow<T>, broadcast: Function | null = null) {
        this.data = data
        this.changes = {}
        this._broadcast = broadcast
    }

    get id(): number {
        return this.data.id
    }

    get unsaved(): boolean {
        return Boolean(Object.keys(this.changes).length)
    }

    getColumn<C extends DatabaseColumnName<T>>(name: C): DatabaseColumnValue<T, C> {
        if (name in this.changes) {return this.changes[name] as DatabaseColumnValue<T, C>}
        else return this.data[name]
    }

    setColumn<C extends DatabaseColumnName<T>>(name: DatabaseColumnName<T>, value: DatabaseColumnValue<T, C>) {
        const isOriginalValue = (this.data[name] === value)
        const isUnsavedChange = (name in this.changes)
        const isUnsavedValue = (value === this.changes[name])

        if (!isUnsavedChange) {
            if (isOriginalValue) return
        }
        if (isUnsavedChange) {
            if (isUnsavedValue) return
            if (isOriginalValue) {
                delete this.changes[name]
                this.broadcast()
                return
            }
        }

        this.changes[name] = value
        this.broadcast()
    }

    update(changes: DatabaseUpdate<T>) {
        Object.entries(changes).forEach(([key , value]) => {
            this.setColumn(
                key as DatabaseColumnName<T>, 
                value as DatabaseColumnValue<T, DatabaseColumnName<T>>
            )
        })
    }

    resetChanges() {
        this.changes = {}
        this.broadcast()
    }

    async saveChangesToDB(table: DatabaseTableName) {
        const { error } = await supabase.from(table)
            .update(this.changes).eq('id', this.data.id)
        
        if (error) throw Error(error.message)

        this.saveChangesToProxy()
    }

    saveChangesToProxy() {
        Object.assign(this.data, this.changes)
        this.changes = {}
        this.broadcast()
    }

    broadcast() {
        if (this._broadcast) this._broadcast()
    }
}

export function updateProxy<T extends DatabaseTableName, P extends ProxyDBRow<T>>(
    proxies: P[], update: DatabaseUpdate<T>, tableName: DatabaseTableName) {
    
    if (!update.id) throw Error(`No ID passed in update to '${tableName}'`)

    const index = proxies.findIndex(v=>v.id===update.id)
    const proxy = proxies[index]

    if (!proxy) throw Error(`No '${tableName}' row found with ID:${update.id}`)

    proxy.update(update)
    proxy.saveChangesToProxy()
}

export function getProxies<T extends DatabaseTableName, R extends DatabaseRow<T>, P extends ProxyDBRow<T>>(
    rows: R[], set: Function, constructor: { new(row: R, bc: Function): P}): P[] {

    const proxies: P[] = []
    const broadcast = () => set(proxies)

    rows.forEach(row => {
        proxies.push(
            // new LayoutNodeCls(n, broadcast)
            new constructor(row, broadcast)
        )
    })

    return proxies
}