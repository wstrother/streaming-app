import { writable, type Writable } from "svelte/store"
import { localStorageStore } from '@skeletonlabs/skeleton'
import { get } from "svelte/store"


export const activeNodeID = writable<number|null>(null)
export const activeVarId = writable<number|null>(null)
export const scalePercent: Writable<number> = localStorageStore('scalePercent', 100)

export const wheel = (e: WheelEvent) => {
    let value = get(scalePercent)
    if (e.deltaY > 0) {
        scalePercent.set(Math.max(value - 5, 25))
    } else if (e.deltaY < 0) {
        scalePercent.set(Math.min(value + 5, 100))
    }
}

export type ctxOptions = {
    hidden?: boolean
    top?: number
    left?: number
}

export const ctxMenu = writable<ctxOptions>({})