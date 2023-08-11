import { ProxyDBRow } from './dbProxy'


describe('ProxyDBRow', () => {
    let proxy: ProxyDBRow<'state_variables'>
    const broadcast = vi.fn()

    beforeEach(() => {
        broadcast.mockClear()
        proxy = new ProxyDBRow<'state_variables'>({
            created_at: "yesterday",
            id: 1,
            key: "myVar",
            user_id: "me",
            value: "cool"
        }, broadcast)
    })
    
    test("that the Proxy stages unsaved changes", () => {
        proxy.update({value: "lame"})
        
        expect(proxy.unsaved).toBe(true)
        expect(proxy.changes.value).toBe("lame")
        expect(proxy.data.value).toBe("cool")

        proxy.update({value: "cool"})
        expect(proxy.unsaved).toBe(false)
        expect(proxy.changes.value).toBeUndefined()
    })

    test("that it exposes an ID", ({}) => {
        expect(proxy.id).toBe(1)
    })

    test("that it can get and set columns", () => {
        proxy.setColumn('value', 'lame')
        expect(proxy.changes.value).toBe('lame')
        expect(proxy.getColumn('value')).toBe('lame')
        
        proxy.setColumn('value', 'cool')
        expect(proxy.changes.value).toBeUndefined()
        expect(proxy.getColumn('value')).toBe('cool')
    })

    test("that it can reset staged changes", () => {
        proxy.update({value: "lame"})
        proxy.resetChanges()
        expect(proxy.getColumn('value')).toBe('cool')
    })

    test("that it can sync to DB updates", () => {
        proxy.update({value: 'lame'})
        proxy.saveChangesToProxy()
        expect(proxy.changes).toStrictEqual({})
    })

    test("that it broadcasts changes using injected broadcast function", () => {
        // update proxy
        proxy.update({value: 'lame'})
        expect(broadcast).toBeCalled()
        broadcast.mockReset()

        // set column
        proxy.setColumn('value', 'cool')
        expect(broadcast).toBeCalled()
        broadcast.mockReset()

        // reset proxy
        proxy.update({value: 'changed'})
        expect(broadcast).toBeCalled()
        proxy.resetChanges()
        broadcast.mockReset()

        // save changes
    })
})