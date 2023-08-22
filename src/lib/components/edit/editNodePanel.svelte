<script lang="ts">
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"

    export let proxy: LayoutNodeProxy
</script>

<EditProxyPanel {proxy} attrs={[
    ['top', 'number'],
    ['left', 'number'],
    'content',
    ['width', 'number'],
    ['height', 'number']
]}/>

