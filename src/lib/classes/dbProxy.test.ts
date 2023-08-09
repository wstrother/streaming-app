import { expect } from 'vitest'
import { ProxyDBRow, ProxyDBQuery } from './dbProxy'

const STATE_VAR_DATA = {
    created_at: "yesterday",
    id: 1,
    key: "myVar",
    user_id: "me",
    value: "cool"
}

test("that the Proxy stages unsaved changes", () => {
    let proxy = new ProxyDBRow<'state_variables'>(STATE_VAR_DATA)
    proxy.update({value: "lame"})

    expect(proxy.unsaved).toBe(true)
    expect(proxy.changes.value).toBe("lame")
    expect(proxy.data.value).toBe("cool")
})

test("that it exposes an ID", () => {
    let proxy = new ProxyDBRow<'state_variables'>(STATE_VAR_DATA)
    expect(proxy.id).toBe(1)
})

test("that it can get and set columns", () => {
    let proxy = new ProxyDBRow<'state_variables'>(STATE_VAR_DATA)

    proxy.setColumn('value', 'lame')
    expect(proxy.changes.value).toBe('lame')
    expect(proxy.getColumn('value')).toBe('lame')
    
    proxy.setColumn('value', 'cool')
    expect(proxy.changes.value).toBe(undefined)
    expect(proxy.getColumn('value')).toBe('cool')
})

test("that it can reset staged changes", () => {
    let proxy = new ProxyDBRow<'state_variables'>(STATE_VAR_DATA)
    proxy.update({value: "lame"})
    proxy.resetChanges()
    expect(proxy.getColumn('value')).toBe('cool')
})

test("that it can sync to DB updates", () => {
    let proxy = new ProxyDBRow<'state_variables'>(STATE_VAR_DATA)
    proxy.update({value: 'lame'})
    proxy.saveChangesToProxy()
    expect(proxy.changes).toStrictEqual({})
})


