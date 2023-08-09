import type { Database } from "$lib/types/supabase"

type DatabaseTableName = keyof Database['public']['Tables']
type DatabaseTable = Database['public']['Tables']
type DatabaseRow<T extends DatabaseTableName> = DatabaseTable[T]['Row']
type DatabaseUpdate<T extends DatabaseTableName> = DatabaseTable[T]['Update']

type DatabaseColumnName<T extends DatabaseTableName> = keyof DatabaseRow<T> & keyof DatabaseUpdate<T>
type DatabaseColumnValue<T extends DatabaseTableName, C extends DatabaseColumnName<T>> = DatabaseRow<T>[C]


export class ProxyDBRow<T extends DatabaseTableName> {
    data: DatabaseRow<T>
    changes: DatabaseUpdate<T>

    constructor(data: DatabaseRow<T>) {
        this.data = data
        this.changes = {}
    }

    get id(): number {
        return this.data.id
    }

    get unsaved(): boolean {
        return Boolean(Object.keys(this.changes).length)
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
            }
        }

        this.changes[name] = value
    }

    update(changes: DatabaseUpdate<T>) {
        Object.entries(changes).forEach(([key , value]) => {
            this.setColumn(
                key as DatabaseColumnName<T>, 
                value as DatabaseColumnValue<T, DatabaseColumnName<T>>
            )
        })
    }
}

export class ProxyDBQuery<T extends DatabaseTableName> {
    rows: ProxyDBRow<T>[] = []

    setRows(rows: DatabaseRow<T>[]) {
        this.rows = rows.map(r=>new ProxyDBRow<T>(r))
    }

    getRow(id: number): ProxyDBRow<T> {
        const index = this.rows.findIndex(r=>r.id===id)
        const proxy = this.rows[index]
        if (proxy) { return proxy }
        else throw Error(`No results found with id ${id}`)
    }

    updateRow(changes: DatabaseUpdate<T>, id: number) {
        const proxy = this.getRow(id)
        proxy.update(changes)
    }
}