import type { Database } from '$lib/types/supabase';

type LayoutNodeDB = Database['public']['Tables']['layout_nodes']['Row']
type LayoutNodeArray = Array<LayoutNodeDB>

export class LayoutNodeCls {
    data: LayoutNodeDB
    _size: [number, number]
    _position: [number, number]
    _classes: string
    _content: string

    constructor(node: LayoutNodeDB) {
        this.data = node
        this._size = [node.width, node.height]
        this._position = [node.left, node.top]
        this._classes = node.classes ?? ''
        this._content = node.content ?? ''
    }

    get top(): number { return this._position[1] }
    get left(): number { return this._position[0] }
    get width(): number { return this._size[0] }
    get height(): number { return this._size[1] }
    get classes(): string { return this._classes }
    get content(): string { return this._content }

    get variable_id(): number | null { return this.data.variable_id }
    get id(): number { return this.data.id }
    get key(): string { return this.data.key }

    setSize(width: number, height: number) {
        this._size = [width, height]
    }

    setPosition(left: number, top: number) {
        this._position = [left, top]
    }

    setCSS(classes: string) {
        this._classes = classes
    }

    get unsaved() {
        return (
            this.left !== this.data.left &&
            this.top !== this.data.top &&
            this.width !== this.data.width &&
            this.height !== this.data.height &&
            this.classes !== this.data.classes &&
            this.content !== this.data.content
        )
    }

}


export class LayoutTree {
    _nodes: Map<string, LayoutNodeCls>

    constructor(nodes: LayoutNodeArray) {
        this._nodes = new Map()
        nodes.forEach(node => {
            this._nodes.set(node.key, new LayoutNodeCls(node))
        })
    }

    get nodes(): Array<LayoutNodeCls> {
        return Array.from(this._nodes.values())
    }

    updateNode(node: LayoutNodeDB) {
        const nodeCls = this._nodes.get(node.key)
        if (nodeCls && nodeCls.unsaved) {
            console.warn(`${nodeCls.key} was updated in DB while changes were unsaved`)
        }
        
        this._nodes.set(node.key, new LayoutNodeCls(node))
    }
}

