import { writable } from "svelte/store"
import type { LayoutNodeDB } from "$lib/stores/layoutStore"

export const activeNode = writable<LayoutNodeDB|null>()
