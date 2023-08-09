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
})

