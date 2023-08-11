import { writable, type Writable } from 'svelte/store'
import { ProxyDBRow, ProxyDBQuery } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate } from './dbProxy'

export type LayoutNodeRow = DatabaseRow<'layout_nodes'>
export type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>

export class LayoutNodeCls extends ProxyDBRow<'layout_nodes'> {
    // tree: LayoutTreeCls

    constructor(node: LayoutNodeRow, broadcast: Function | null) {
        super(node, broadcast)
    }

    update(changes: LayoutNodeUpdate): LayoutNodeCls {
        super.update(changes)
        // this.tree.broadcastChanges()
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

    async saveChangesToDB(): Promise<LayoutNodeCls> {
        await super.saveChangesToDB('layout_nodes')
        return this
    }
}


// export class LayoutTreeCls extends ProxyDBQuery<'layout_nodes', LayoutNodeCls> {
//     _store: Writable<LayoutNodeCls[]>

//     constructor() {
//         super()
//         this._store = writable(this.rows)
//     }




//     broadcastChanges() {
    //         this._store.set(this.rows)
    //     }
    // }
    
    // const layoutTree = new LayoutTreeCls()
const {subscribe, set, update} = writable<LayoutNodeCls[]>([])
    
// export function updateNode(node: LayoutNodeUpdate, id: number) {
//     super.updateRow(node, id)
//     set(rows)
// }

export function updateNode(nodes: LayoutNodeCls[], update: LayoutNodeUpdate) {
    if (!update.id) throw Error('No ID passed in update to layout_nodes')

    const index = nodes.findIndex(n=>n.id===update.id)
    const node = nodes[index]

    if (!node) throw Error(`No node found with ID:${update.id}`)

    node.update(update)
    // return nodesCls
}

export function getNodes(nodes: LayoutNodeRow[]) {
    const nodesCls: LayoutNodeCls[] = []
    const broadcast = () => set(nodesCls)

    nodes.forEach(n => {
        nodesCls.push(
            new LayoutNodeCls(n, broadcast)
        )
    })

    return nodesCls
}

export const layoutNodes = {
    subscribe, set, update,
    
    // setNodes,

    // updateNode: (node: LayoutNodeUpdate) => {
    //     layoutTree.updateNode(node, node?.id as number)
    // }
}