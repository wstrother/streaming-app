import { writable } from "svelte/store"
import UnsavedPanel from "./unsavedPanel.svelte"
import { render, screen } from '@testing-library/svelte'

vi.mock('$lib/classes/layoutNodes', () => {
    const mockNodes = []

    const {subscribe, set, update} = writable(mockNodes)

    return {
        layoutNodes: { subscribe, set, update }
    }
})

describe("UnsavedPanel", () => {
    

    test("that it lists unsaved layout nodes", () => {
        render(UnsavedPanel)
        
        expect(screen.queryByText('Unsaved Changes:')).toBeNull()

        // How do I reference the mocked store so that I can call the set function and change its value???

    })
})