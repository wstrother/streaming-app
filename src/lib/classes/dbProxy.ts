import { supabase } from "$lib/supabaseClient"
import type { Database } from "$lib/types/supabase"

export type DatabaseTableName = keyof Database['public']['Tables']
export type DatabaseTable = Database['public']['Tables']
export type DatabaseRow<T extends DatabaseTableName> = DatabaseTable[T]['Row']
export type DatabaseUpdate<T extends DatabaseTableName> = DatabaseTable[T]['Update']
export type DatabaseInsert<T extends DatabaseTableName> = DatabaseTable[T]['Insert']
export type DatabaseColumnName<T extends DatabaseTableName> = T extends DatabaseTableName ? keyof DatabaseRow<T> & keyof DatabaseUpdate<T> : never
export type DatabaseColumnValue<T extends DatabaseTableName, C extends DatabaseColumnName<T>> = DatabaseRow<T>[C]

export type StateVarTypesLiterals = DatabaseColumnValue<"state_variables", "type">
export type StateVarValue = string|number|boolean|null

type colName = DatabaseColumnName<DatabaseTableName>
type colNameType = [colName, StateVarTypesLiterals]
export type ProxyAttr = colName|colNameType
export type ProxyAttrs = ProxyAttr[]


export class ProxyDBRow<T extends DatabaseTableName> {
    data: DatabaseRow<T>
    changes: DatabaseUpdate<T>
    _broadcast: Function | null
    client: boolean

    constructor(data: DatabaseRow<T>, broadcast: Function, client: boolean=false) {
        this.data = data
        this.changes = {}
        this._broadcast = broadcast
        this.client = client
    }

    get id(): number|null {
        return this.data.id ?? null
    }

    get unsaved(): boolean {
        if (this.client) return true
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
        if (!this.client) {
            const { error } = await supabase.from(table)
                .update(this.changes).eq('id', this.data.id)
            
            if (error) throw Error(error.message)
    
            this.saveChangesToProxy()
        } else {
            this.saveChangesToProxy()
            const insert = this.data as DatabaseInsert<T>
            delete insert.created_at
            delete insert.id

            const { data, error } = await supabase.from(table)
                .insert(this.data).select().single()
            
            if (error) throw Error(error.message)
            if (data && data.id) this.data.id = data.id
            this.client = false
        }
    }

    async deleteFromDB(table: DatabaseTableName) {
        if (!this.client) {
            const { error } = await supabase.from(table)
                .delete().eq("id", this.data.id).select().single()
            
            if (error) throw Error(error.message)
        }
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

export function getProxies<T extends DatabaseTableName, R extends DatabaseRow<T>, P extends ProxyDBRow<T>>
    (rows: R[], set: Function, constructor: { new(row: R, bc: Function): P}): P[] {

        const proxies: P[] = []
        const broadcast = () => set(proxies)

        rows.forEach(row => {
            proxies.push(
                new constructor(row, broadcast)
            )
        })

        return proxies
}