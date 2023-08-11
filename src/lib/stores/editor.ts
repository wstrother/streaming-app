import { writable, type Writable } from "svelte/store"
import type { LayoutNodeCls } from "$lib/classes/layoutNodes"
import { localStorageStore } from '@skeletonlabs/skeleton'
import { get } from "svelte/store"


export const activeNode = writable<LayoutNodeCls | null>()

export const scalePercent: Writable<number> = localStorageStore('scalePercent', 100)

export const wheel = (e: WheelEvent) => {
    e.preventDefault()

    let value = get(scalePercent)
    if (e.deltaY > 0) {
        scalePercent.set(Math.max(value - 5, 25))
    } else if (e.deltaY < 0) {
        scalePercent.set(Math.min(value + 5, 100))
    }
}