import { StateVariableProxy } from "./stateVariables"

describe('StateVariableProxy', () => {
    let varProxy: StateVariableProxy
    const broadcast = vi.fn()

    beforeEach(() => {
        broadcast.mockClear()
        varProxy = new StateVariableProxy({
            id: 1,
            user_id: "1",
            created_at: "",
            value: "cool",
            key: "test"
        }, broadcast)
    })

    test("that it exposes its value and key as properties", () => {
        
    })
})

// TODO test writeable support functions