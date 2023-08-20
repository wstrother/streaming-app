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
            key: "test",
            type: "string"
        }, broadcast)
    })

    test("that it exposes its value, type and key as properties", () => {
        expect(varProxy.key).toBe("test")
        expect(varProxy.value).toBe("cool")
        expect(varProxy.type).toBe("string")
    })
})

// TODO test writeable support functions