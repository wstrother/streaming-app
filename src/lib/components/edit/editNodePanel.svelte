<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy"
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"

    export let proxy: LayoutNodeProxy
    let attrs: ProxyAttrs
    if (proxy.parent_node_id) {
        attrs = [
            ['top', 'number'],
            ['left', 'number'],
            'content',
            ['width', 'number'],
            ['height', 'number']
        ]
    } else {
        attrs = [
            'content',
            ['width', 'number'],
            ['height', 'number']
        ]
    }        

</script>

<EditProxyPanel {proxy} {attrs}/>

