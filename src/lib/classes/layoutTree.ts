import type { LayoutNode, LayoutNodeArray } from "$lib/stores/layoutNodes";


class LayoutNodeCls {
    data: LayoutNode
    _size: [number, number]
    _position: [number, number]
    _classes: string
    _content: string

    constructor(node: LayoutNode) {
        this.data = node
        this._size = [node.width, node.height]
        this._position = [node.left, node.top]
        this._classes = node.classes ?? ''
        this._content = node.content ?? ''
    }

    get top() { return this._position[1] }
    get left() { return this._position[0] }
    get width() { return this._size[0] }
    get height() { return this._size[1] }
    get classes() { return this._classes }
    get content() { return this.data.content }

    get variable_id() { return this.data.variable_id }
    get key() { return this.data.key }
    get id() { return this.data.id }

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


class LayoutTree {
    nodes: Array<LayoutNodeCls>

    constructor(nodes: LayoutNodeArray) {
        this.nodes = nodes.map(n => new LayoutNodeCls(n))
    }
}

