import { readable, type Readable } from "svelte/store"

interface Position {x: number, y: number}
interface MouseStore {mousePosition: Readable<Position>, mouseHeld: Readable<boolean>}

function createMouse(): MouseStore {
    const mousePosition = readable<Position>({x: 0, y: 0}, (set) => {
        const handleMove = (event: MouseEvent) => {
            set({x: event.clientX, y: event.clientY})
        }
        
        document.body.addEventListener("mousemove", handleMove)
    
        return () => document.body.removeEventListener("mousemove", handleMove)
    })
    
    const mouseHeld = readable<boolean>(false, (set) => {
        const handleClick: EventListener = (event: Event) => {
            // console.log(event.type)
            if (event.type === "mousedown") set(true)
            if (event.type === "mouseup") set(false)
        }
    
        ["mousedown","mouseup"].forEach(eventName => document.body.addEventListener(eventName, handleClick))
    
        return () => {
            // console.log('UNSUB');
            ["mousedown","mouseup"].forEach(eventName => document.body.removeEventListener(eventName,handleClick))
        }
    })

    return { mousePosition, mouseHeld }
}

export const mouse = createMouse()