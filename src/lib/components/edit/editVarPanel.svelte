<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy"
	import type { StateVariableProxy } from "$lib/classes/stateVariables"
    import EditProxyPanel from "./editProxyPanel.svelte"

    export let proxy: StateVariableProxy

    let attrs: ProxyAttrs = [
        "key",
        ["value", proxy.type]
    ]
</script>

<EditProxyPanel {proxy} {attrs}/>
