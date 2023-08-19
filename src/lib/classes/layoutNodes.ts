import { writable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseColumnValue, DatabaseRow, DatabaseUpdate } from './dbProxy'

export type LayoutNodeRow = DatabaseRow<'layout_nodes'>
export type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>

export class LayoutNodeProxy extends ProxyDBRow<'layout_nodes'> {
    get top(): number { return this.getColumn('top') }
    get left(): number { return this.getColumn('left') }
    get width(): number { return this.getColumn('width') }
    get height(): number { return this.getColumn('height') }
    get classes(): string { return this.getColumn('classes') || '' }
    get content(): string { return this.getColumn('content') || '' }
    get variable_id(): number | null { return this.getColumn("variable_id") }
    get key(): string { return this.getColumn("key") }

    get size(): [number, number] {
        return [this.width, this.height]
    }

    get position(): [number, number] {
        return [this.left, this.top]
    }

    setSize(width: number, height: number) {
        this.update({width, height})
    }

    setPosition(left: number, top: number) {
        this.update({
            left: Math.round(left),
            top: Math.round(top)
        })
    }

    setContent(content: string) {
        this.update({content})
    }

    move(dx: number, dy: number) {
        let [x, y] = this.position
        this.setPosition(x + dx, y + dy)
    }

    setCSS(classes: string) {
        this.update({classes})
    }

    async saveChangesToDB() {
        await super.saveChangesToDB('layout_nodes')
    }
}


const {subscribe, set, update} = writable<LayoutNodeProxy[]>([])


export const layoutNodes = {
    subscribe, set, update,

    updateNode: (nodes: LayoutNodeProxy[], update: LayoutNodeUpdate) => {
        updateProxy<'layout_nodes', LayoutNodeProxy>(
            nodes, update, 'layout_nodes'
        )
    },

    getNodes: (nodes: LayoutNodeRow[]): LayoutNodeProxy[] => {
        return getProxies<'layout_nodes', LayoutNodeRow, LayoutNodeProxy>(
            nodes, set, LayoutNodeProxy
        )
    },

    getNodeByID: (nodes: LayoutNodeProxy[], id: number|null): LayoutNodeProxy|null => {
        return nodes.filter(n=>n.id===id)[0] ?? null
    }
}