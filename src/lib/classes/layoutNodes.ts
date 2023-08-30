import { writable } from 'svelte/store'
import { ProxyDBRow, getProxies, updateProxy } from './dbProxy'
import type { DatabaseRow, DatabaseUpdate, StateVarValue } from './dbProxy'

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

    static getAsInsert(key: string, user_id: string, layout_id: number, broadcast: Function): LayoutNodeProxy {
        const data: DatabaseRow<'layout_nodes'> = {
            boolean_key: null,
            classes: "absolute",
            content: null,
            created_at: "",
            id: 0,
            img_src: null,
            key,
            layout_id,
            parent_node_id: null,
            sibling_order: null,
            user_id,
            variable_id: null,
            left: 500,
            top: 500,
            height: 200,
            width: 200
        }

        return new LayoutNodeProxy(data, broadcast, true)
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

    addNode: (nodes: LayoutNodeProxy[], key: string, user_id: string, layout_id: number) => {
        const node = LayoutNodeProxy.getAsInsert(key, user_id, layout_id, () => set(nodes))
        node.broadcast
        nodes.push(node)
        set(nodes)
    }
}