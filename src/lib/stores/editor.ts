import { writable } from "svelte/store"
import type { LayoutNode } from "$lib/stores/layoutStore"

export const activeNode = writable<LayoutNode|null>()
