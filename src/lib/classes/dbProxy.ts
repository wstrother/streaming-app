import type { Database } from "$lib/types/supabase"

type DatabaseTable = Database['public']['Tables'][keyof Database['public']['Tables']]
type DatabaseRow = DatabaseTable['Row']
type DatabaseColumnValue = DatabaseRow[keyof DatabaseRow]
type DatabaseUpdate = DatabaseTable['Update']
type DatabaseColumnName = keyof DatabaseUpdate | keyof DatabaseRow

class ProxyDBRow {
    data: DatabaseRow
    changes: DatabaseUpdate

    constructor(data: DatabaseRow) {
        this.data = data
        this.changes = {}
    }

    get id(): number {
        return this.data.id
    }

    get unsaved(): boolean {
        return Boolean(Object.keys(this.changes).length)
    }

    setColumn(name: DatabaseColumnName, value: DatabaseColumnValue) {
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
}