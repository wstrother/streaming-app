import { LayoutNodeProxy } from "./layoutNodes"

describe('LayoutNodeProxy', () => {
    let nodeProxy: LayoutNodeProxy
    const broadcast = vi.fn()

    beforeEach(() => {
        broadcast.mockClear()
        nodeProxy = new LayoutNodeProxy({
            classes: "",
            content: "",
            created_at: "",
            height: 100,
            id: 1,
            key: "test_node",
            layout_id: 1,
            left: 100,
            top: 100,
            user_id: "1",
            variable_id: 1,
            width: 100,
        }, broadcast)
    })

    test("That it exposes column names as properties", () => {

    })

    test("That its size can be set directly", () => {
        
    })

    test("That its position can be set directly to the nearest integer value", () => {
        
    })

    test("That its content can be set directly", () => {
        
    })

    test("That it can be moved by a dx, dy value", () => {
        
    })

    test("That its CSS classes can be set directly", () => {
        
    })

    // test("That it saves its changes to the DB by updating the 'layout_nodes' table", () => {
        
    // })

    // TODO: refactor so self returns not necessary?
})

// TODO test writeable support functions