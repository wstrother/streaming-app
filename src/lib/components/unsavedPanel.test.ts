import { writable } from "svelte/store"
import UnsavedPanel from "./unsavedPanel.svelte"
import { layoutNodes } from "$lib/classes/layoutNodes"
import { render, screen } from '@testing-library/svelte'

// vi.mock('$lib/classes/layoutNodes', () => {
//     const mockNodes = []

//     const {subscribe, set, update} = writable(mockNodes)

//     return {
//         layoutNodes: { subscribe, set, update }
//     }
// })


describe("UnsavedPanel", () => {
    
    test("that it lists unsaved layout nodes", () => {
        const {set, subscribe} = writable<any[]>([])
        vi.spyOn(layoutNodes, 'subscribe').mockImplementation(subscribe)
        
        render(UnsavedPanel)
        
        expect(screen.queryByText('Unsaved Changes:')).toBeTruthy()
        expect(screen.queryByText('test_node')).toBeTruthy()


        // expect(screen.queryByText('test_node')).toBeTruthy()
    })
})