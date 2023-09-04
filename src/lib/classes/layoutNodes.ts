import { get, writable } from 'svelte/store'
import { ProxyDBRow, initProxies, updateProxy } from './dbProxy'
import type { DatabaseInsert, DatabaseRow, DatabaseUpdate, StateVarValue } from './dbProxy'

export type LayoutNodeRow = DatabaseRow<'layout_nodes'>
export type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>
export type LayoutNodeInsert = DatabaseInsert<'layout_nodes'>

let CLIENT_ID = -1

export class LayoutNodeProxy extends ProxyDBRow<'layout_nodes'> {
    _table = 'layout_nodes' as const
    parentNode: LayoutNodeProxy|null = null

    get key(): string { return this.getColumn("key") }
    get top(): number|null { return this.getColumn('top') }
    get left(): number|null { return this.getColumn('left') }
    get width(): number|null { return this.getColumn('width') }
    get height(): number|null { return this.getColumn('height') }
    get classes(): string { return this.getColumn('classes') || '' }
    get content(): string { return this.getColumn('content') || '' }

    get user_id(): string|null { return this.getColumn("user_id") }
    get variable_id(): number|null { return this.getColumn("variable_id") }
    get boolean_id(): number|null { return this.getColumn("boolean_id")}
    get parent_node_id(): number|null { return this.getColumn("parent_node_id") }
    get sibling_order(): number|null { return this.getColumn("sibling_order") }
    get image(): string|null { return this.getColumn("img_src") }

    get size(): [number, number] {
        return [this.width ?? 0, this.height ?? 0]
    }

    get position(): [number, number] {
        return [this.left ?? 0, this.top ?? 0]
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

    // async deleteFromDB() {
    //     await super.deleteFromDB('layout_nodes')
    // }

    interpolate(getVarByKey: (key: string) => StateVarValue): string {
        return this.content.replace(/{([^}]+)}/g, (match: string, key: string) => {
            const replacement = getVarByKey(key)
        
            if (replacement) {
                return String(replacement)
            } else {
                return match
            }
        })
    }

    static getAsInsert(
        data: LayoutNodeInsert, broadcast: Function, client: boolean = true
        ): LayoutNodeProxy {

            const defaults: DatabaseRow<'layout_nodes'> = {
                boolean_id:null,
                classes:"",
                content:"",
                created_at:"",
                id:CLIENT_ID,
                key:"",
                layout_id:null,
                user_id:"",
                img_src:null,
                parent_node_id:null,
                sibling_order:null,
                variable_id:null,
                left:0,
                top:0,
                height:null,
                width:null
            }
            CLIENT_ID -= 1

            return new LayoutNodeProxy(
                {...defaults, ...data}, 
                broadcast, 
                client
            )
    }
}


const nodeStore = writable<LayoutNodeProxy[]>([])
let nodeStoreInitialized = false

export const layoutNodes = {
    subscribe: nodeStore.subscribe, 
    set: nodeStore.set, 
    update: nodeStore.update,

    updateData: (update: LayoutNodeUpdate) => {
        const nodeArray = get(nodeStore)
        updateProxy<'layout_nodes', LayoutNodeProxy>(
            nodeArray, update, 'layout_nodes'
        )
    },

    init: (nodes: LayoutNodeRow[]) => {
        if (!nodeStoreInitialized) {
            console.log("initializing layout nodes")
            initProxies<'layout_nodes', LayoutNodeRow, LayoutNodeProxy>(
                nodes, nodeStore.set, LayoutNodeProxy
            )
            nodeStoreInitialized = true
        }
    },

    resetStore: () => {
        nodeStore.set([])
        nodeStoreInitialized = false
    },

    getNodeByID: (nodes: LayoutNodeProxy[], id: number|null): LayoutNodeProxy|null => {
        return nodes.filter(n=>n.id===id)[0] ?? null
    },

    // refactor in both files, prefer get(nodeStore)
    add: (nodes: LayoutNodeProxy[], data: LayoutNodeInsert) => {
        const node = LayoutNodeProxy.getAsInsert(
            data, () => nodeStore.set(nodes))
        nodes.push(node)
        nodeStore.set(nodes)
    },

    addFromDB: (data: LayoutNodeInsert) => {
        const nodeArray = get(nodeStore)
        nodeArray.push(LayoutNodeProxy.getAsInsert(
            data,
            () => nodeStore.set(nodeArray),
            false   // client = false
        ))
    },

    delete: (nodes: LayoutNodeProxy[], node: LayoutNodeProxy) => {
        nodes.splice(nodes.indexOf(node), 1)
        nodeStore.set(nodes)
        // node.deleteFromDB()
    },

    getChildren: (nodes: LayoutNodeProxy[], node:LayoutNodeProxy): LayoutNodeProxy[] => {
        return nodes.filter(n => n.parent_node_id === node.id).sort((a, b) => {
            const {sa, sb} = {sa: a.sibling_order ?? 0, sb: b.sibling_order ?? 0}
            if (sa > sb) return 1
            if (sb > sa) return -1
            return 0
        })
    }
}