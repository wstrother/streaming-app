import { writable, type Writable } from 'svelte/store'
import { ProxyDBRow, ProxyDBQuery } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate } from './dbProxy'

type LayoutNodeRow = DatabaseRow<'layout_nodes'>
type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>

export class LayoutNodeCls extends ProxyDBRow<'layout_nodes'> {
    tree: LayoutTreeCls

    constructor(node: LayoutNodeRow, tree: LayoutTreeCls) {
        super(node)
        this.tree = tree
    }

    update(changes: LayoutNodeUpdate): LayoutNodeCls {
        super.update(changes)
        this.tree.broadcastChanges()
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
    setSize(width: number, height: number): LayoutNodeCls {
        return this.update({width, height})
    }

    setPosition(left: number, top: number): LayoutNodeCls {
        return this.update({
            left: Math.round(left),
            top: Math.round(top)
        })
    }

    setContent(content: string): LayoutNodeCls {
        return this.update({content})
    }

    move(dx: number, dy: number): LayoutNodeCls {
        let [x, y] = this.position
        return this.setPosition(x + dx, y + dy)
    }

    setCSS(classes: string) {
        return this.update({classes})
    }
    
    resetChanges(): LayoutNodeCls {
        super.resetChanges()
        return this.update({})
    }

    async saveChanges(): Promise<LayoutNodeCls> {
        await super.saveChanges('layout_nodes')
        
        this.tree.broadcastChanges()
        return this
    }
}


export class LayoutTreeCls extends ProxyDBQuery<'layout_nodes', LayoutNodeCls> {
    _store: Writable<LayoutNodeCls[]>

    constructor() {
        super()
        this._store = writable(this.rows)
    }

    setNodes(nodes: LayoutNodeRow[]) {
        this.rows = nodes.map(r=>new LayoutNodeCls(r, this))
        this.broadcastChanges()
    }

    updateNode(node: LayoutNodeRow) {
        super.updateRow(node, node.id)
        this.broadcastChanges()
    }

    broadcastChanges() {
        this._store.set(this.rows)
    }
}

const layoutTree = new LayoutTreeCls()
export const layoutNodes = {
    subscribe: layoutTree._store.subscribe,
    set: layoutTree._store.set,
    update: layoutTree._store.update,
    setNodes: (nodes: LayoutNodeRow[]) => layoutTree.setNodes(nodes),
    updateNode: (node: LayoutNodeRow) => layoutTree.updateNode(node)
}