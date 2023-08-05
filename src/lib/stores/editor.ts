import { writable, type Writable } from "svelte/store"
import type { LayoutNodeCls } from "$lib/classes/layoutTree"
import { localStorageStore } from '@skeletonlabs/skeleton'


export const activeNode = writable<LayoutNodeCls | null>()

export const scalePercent: Writable<number> = localStorageStore('scalePercent', 100)