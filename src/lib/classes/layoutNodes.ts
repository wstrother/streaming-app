import { writable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseInsert, DatabaseRow, DatabaseUpdate, StateVarValue } from './dbProxy'

export type LayoutNodeRow = DatabaseRow<'layout_nodes'>
export type LayoutNodeUpdate = DatabaseUpdate<'layout_nodes'>

export class LayoutNodeProxy extends ProxyDBRow<'layout_nodes'> {
    children: LayoutNodeProxy[] = []

    get key(): string { return this.getColumn("key") }
    get top(): number|null { return this.getColumn('top') }
    get left(): number|null { return this.getColumn('left') }
    get width(): number|null { return this.getColumn('width') }
    get height(): number|null { return this.getColumn('height') }
    get classes(): string { return this.getColumn('classes') || '' }
    get content(): string { return this.getColumn('content') || '' }

    get user_id(): string|null { return this.getColumn("user_id") }
    get variable_id(): number|null { return this.getColumn("variable_id") }
    get boolean_id(): number|null { return this.getColumn("boolean_key")}
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

    async saveChangesToDB() {
        await super.saveChangesToDB('layout_nodes')
    }

    async deleteFromDB() {
        await super.deleteFromDB('layout_nodes')
    }

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

    addChild(node: LayoutNodeProxy) {
        this.children.push(node)
        this.children.sort((a, b) => {
            const {sa, sb} = {sa: a.sibling_order ?? 0, sb: b.sibling_order ?? 0}
            if (sa > sb) return 1
            if (sb > sa) return -1
            return 0
        })
    }

    removeChild(node: LayoutNodeProxy) {
        this.children = this.children.filter(n => n.id !== node.id)
    }

    static getAsInsert(data: DatabaseInsert<'layout_nodes'>, broadcast: Function): LayoutNodeProxy {
        const defaults: DatabaseRow<'layout_nodes'> = {
            boolean_key:null,
            classes:"absolute",
            content:"",
            created_at:"",
            id:0,
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

        return new LayoutNodeProxy({...defaults, ...data}, broadcast, true)
    }
}


const {subscribe, set, update} = writable<LayoutNodeProxy[]>([])


export const layoutNodes = {
    subscribe, set, update,

    updateData: (nodes: LayoutNodeProxy[], update: LayoutNodeUpdate) => {
        updateProxy<'layout_nodes', LayoutNodeProxy>(
            nodes, update, 'layout_nodes'
        )
    },

    getNodes: (nodes: LayoutNodeRow[]): LayoutNodeProxy[] => {
        const proxies = getProxies<'layout_nodes', LayoutNodeRow, LayoutNodeProxy>(
            nodes, set, LayoutNodeProxy
        )

        proxies.forEach(n => {
            if (!n.parent_node_id) return

            const parent = proxies.filter(p=>p.id===n.parent_node_id)[0] ?? null
            if (parent) parent.addChild(n)
        })

        return proxies
    },

    getNodeByID: (nodes: LayoutNodeProxy[], id: number|null): LayoutNodeProxy|null => {
        return nodes.filter(n=>n.id===id)[0] ?? null
    },

    add: (nodes: LayoutNodeProxy[], data: DatabaseInsert<'layout_nodes'>) => {
        const node = LayoutNodeProxy.getAsInsert(data, () => set(nodes))
        nodes.push(node)
        set(nodes)
        if (node.parent_node_id) {
            const parent = nodes.filter(n => n.id === node.parent_node_id)[0]
            parent.addChild(node)
        }
    },

    delete: (nodes: LayoutNodeProxy[], node: LayoutNodeProxy) => {
        nodes.splice(nodes.indexOf(node), 1)
        set(nodes)
        node.deleteFromDB()
        if (node.parent_node_id) {
            const parent = nodes.filter(n => n.id === node.parent_node_id)[0]
            parent.removeChild(node)
        }
    }
}