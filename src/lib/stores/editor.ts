import { writable } from "svelte/store"
import type { LayoutNodeCls } from "$lib/classes/layoutTree"

export const activeNode = writable<LayoutNodeCls | null>()

export const scalePercent = writable<number>(100)