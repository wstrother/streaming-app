<script lang="ts">
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"

    export let node: LayoutNodeProxy
</script>

<EditProxyPanel proxy={node} attrs={[
    ['top', 'number'],
    ['left', 'number'],
    'content',
    ['width', 'number'],
    ['height', 'number']
]}/>

