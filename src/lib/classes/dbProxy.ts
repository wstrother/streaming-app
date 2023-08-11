import { supabase } from "$lib/supabaseClient"
import type { Database } from "$lib/types/supabase"

export type DatabaseTableName = keyof Database['public']['Tables']
export type DatabaseTable = Database['public']['Tables']
export type DatabaseRow<T extends DatabaseTableName> = DatabaseTable[T]['Row']
export type DatabaseUpdate<T extends DatabaseTableName> = DatabaseTable[T]['Update']
export type DatabaseColumnName<T extends DatabaseTableName> = keyof DatabaseRow<T> & keyof DatabaseUpdate<T>
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

    async saveChangesToDB(table: DatabaseTableName): Promise<ProxyDBRow<T>> {
        const { error } = await supabase.from(table)
            .update(this.changes).eq('id', this.data.id)
        
        if (error) throw Error(error.message)

        this.saveChangesToProxy()

        return this
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

export class ProxyDBQuery<T extends DatabaseTableName, R extends ProxyDBRow<T>> {
    rows: R[] = []

    getRow(id: number): ProxyDBRow<T> {
        const index = this.rows.findIndex(r=>r.id===id)
        const proxy = this.rows[index]
        if (proxy) { return proxy }
        else throw Error(`No results found with id ${id}`)
    }

    updateRow(changes: DatabaseUpdate<T>, id: number) {
        const proxy = this.getRow(id)
        proxy.update(changes)
        proxy.saveChangesToProxy()
    }
}