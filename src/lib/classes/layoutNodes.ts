import { writable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate } from './dbProxy'

export type LayoutNodeRow = DatabaseRow<'layout_nodes'>
export type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>


export class LayoutNodeProxy extends ProxyDBRow<'layout_nodes'> {
    constructor(node: LayoutNodeRow, broadcast: Function | null) {
        super(node, broadcast)
    }

    update(changes: LayoutNodeUpdate): LayoutNodeProxy {
        super.update(changes)
        return this
    }

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

    // the self return pattern is a reminder that the object mutation
    // must use an assignment statement to trigger reactivity
    setSize(width: number, height: number): LayoutNodeProxy {
        return this.update({width, height})
    }

    setPosition(left: number, top: number): LayoutNodeProxy {
        return this.update({
            left: Math.round(left),
            top: Math.round(top)
        })
    }

    setContent(content: string): LayoutNodeProxy {
        return this.update({content})
    }

    move(dx: number, dy: number): LayoutNodeProxy {
        let [x, y] = this.position
        return this.setPosition(x + dx, y + dy)
    }

    setCSS(classes: string) {
        return this.update({classes})
    }
    
    resetChanges(): LayoutNodeProxy {
        super.resetChanges()
        return this.update({})
    }

    async saveChangesToDB(): Promise<LayoutNodeProxy> {
        await super.saveChangesToDB('layout_nodes')
        return this
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