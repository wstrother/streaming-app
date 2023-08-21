import { LayoutNodeProxy } from "./layoutNodes"

describe('LayoutNodeProxy', () => {
    let nodeProxy: LayoutNodeProxy
    const broadcast = vi.fn()

    beforeEach(() => {
        broadcast.mockClear()
        nodeProxy = new LayoutNodeProxy({
            classes: "bg-primary-500",
            content: "varkey:",
            created_at: "1",
            height: 100,
            id: 1,
            key: "test_node",
            layout_id: 1,
            left: 100,
            top: 100,
            user_id: "1",
            variable_id: 1,
            width: 100,
            sibling_order: null,
            parent_node_id: null
        }, broadcast)
    })

    test("That it exposes column names as properties", () => {
        expect(nodeProxy.classes).toBe("bg-primary-500")
        expect(nodeProxy.content).toBe("varkey:")
        expect(nodeProxy.key).toBe("test_node")
        expect(nodeProxy.variable_id).toBe(1)
        expect(nodeProxy.top).toBe(100)
        expect(nodeProxy.left).toBe(100)
        expect(nodeProxy.width).toBe(100)
        expect(nodeProxy.height).toBe(100)

    })

    test("That its size can be referenced and set directly", () => {
        expect(nodeProxy.size).toStrictEqual([100, 100])
        nodeProxy.setSize(200, 200)
        expect(nodeProxy.size).toStrictEqual([200, 200])
        expect(nodeProxy.width).toBe(200)
        expect(nodeProxy.height).toBe(200)
        
    })

    test("That its position can be referenced and set directly to the nearest integer value", () => {
        expect(nodeProxy.position).toStrictEqual([100, 100])
        nodeProxy.setPosition(100.9, 150)
        expect(nodeProxy.position).toStrictEqual([101, 150])
    })

    test("That its content can be set directly", () => {
        nodeProxy.setContent('new content')
        expect(nodeProxy.content).toBe('new content')
    })

    test("That it can be moved by a dx, dy value", () => {
        nodeProxy.move(50, 50)
        expect(nodeProxy.position).toStrictEqual([150, 150])
    })

    test("That its CSS classes can be set directly", () => {
        nodeProxy.setCSS('bg-primary-800')
        expect(nodeProxy.classes).toBe('bg-primary-800')
    })

    test("That it can interpolate its content with a getVarByKey function", () => {
        const interp = (key: string): string|undefined => {
            if (key === "var") return "interpolated!"
        }
        expect(nodeProxy.interpolate(interp)).toBe("varkey:")
        nodeProxy.setContent("{var}")
        expect(nodeProxy.interpolate(interp)).toBe("interpolated!")
        nodeProxy.setContent("{var2}")
        expect(nodeProxy.interpolate(interp)).toBe("{var2}")
    })


    // TODO: test("That it saves its changes to the DB by updating the 'layout_nodes' table", () => {
        
    // })

    // TODO: tests for parent / child nodes, sibling order

})
