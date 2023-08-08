import type { Database } from '$lib/types/supabase'
import { supabase } from '$lib/supabaseClient'
import { writable, type Writable } from 'svelte/store'

type LayoutNodeDB = Database['public']['Tables']['layout_nodes']['Row']
type LayoutNodeDBArray = Array<LayoutNodeDB>

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

    // the self return pattern is a reminder that the object mutation
    // must use an assignment statement to trigger reactivity
    setSize(width: number, height: number): LayoutNodeCls {
        this._size = [width, height]
        return this
    }

    setPosition(left: number, top: number): LayoutNodeCls {
        this._position = [Math.round(left), Math.round(top)]
        return this
    }

    setContent(content: string): LayoutNodeCls {
        this._content = content
        return this
    }

    move(dx: number, dy: number): LayoutNodeCls {
        let [x, y] = this._position
        this.setPosition(x + dx, y + dy)

        return this
    }

    resetChanges(): LayoutNodeCls {
        const node = this.data
        this._size = [node.width, node.height]
        this._position = [node.left, node.top]
        this._classes = node.classes ?? ''
        this._content = node.content ?? ''

        return this
    }

    async saveChanges(): Promise<LayoutNodeCls> {
        this.data.top = this.top
        this.data.left = this.left
        this.data.content = this.content
        
        // prefer to send less data
        const { error } = await supabase.from('layout_nodes')
            .update({top:this.top, left:this.left, content:this.content})
            .eq('id', this.id)

        if (error) console.log(error)

        return this
    }

    setCSS(classes: string) {
        this._classes = classes
    }

    get unsaved() {
        return (
            this.left !== this.data.left ||
            this.top !== this.data.top ||
            this.width !== this.data.width ||
            this.height !== this.data.height ||
            this.classes !== (this.data.classes ?? '') ||
            this.content !== (this.data.content ?? '')
        )
    }
}


export class LayoutTreeCls {
    _nodes: Array<LayoutNodeCls>
    _store: Writable<Array<LayoutNodeCls>>
    update: Function
    set: Function
    subscribe: Function

    constructor() {
        console.log('BEING CONSTRUCTED')
        debugger
        this._nodes = []
        this._store = writable(this._nodes)
       
        this.update = this._store.update
        this.set = this._store.set
        this.subscribe = this._store.subscribe
    }

    setNodes(nodes: LayoutNodeDBArray) {
        nodes.forEach(node => {
            this._nodes.push(new LayoutNodeCls(node))
        })
    }

    updateNode(node: LayoutNodeDB) {
        const index = this._nodes.findIndex(n=>n.id===node.id)
        const nodeCls = this._nodes[index]

        if (nodeCls && nodeCls.unsaved) {
            console.warn(`${nodeCls.key} was updated in DB while changes were unsaved`)
        }
        
        this._nodes[index] = new LayoutNodeCls(node)
    }
}

const layoutTree = new LayoutTreeCls()
export const layoutNodes = {
    subscribe: layoutTree._store.subscribe,
    set: layoutTree._store.set,
    update: layoutTree._store.update,
    setNodes: (nodes: Array<LayoutNodeDB>) => layoutTree.setNodes(nodes)
}