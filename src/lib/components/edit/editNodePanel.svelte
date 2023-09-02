<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy";
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"
    import { setParentID, unsetParentID } from "$lib/menuActions"

    export let node: LayoutNodeProxy

    let attrs: ProxyAttrs = [
        'content',
        ['top', 'number'],
        ['left', 'number'],
        'classes',
        ['width', 'number'],
        ['height', 'number'],
    ]
</script>

<EditProxyPanel proxy={node} {attrs}/>

<div class="variant-glass-primary m-4 rounded p-3 text-white flex flex-col">
    <div>
        {#if node.parent_node_id}
            <button on:click={() => unsetParentID(node)}>Unset Parent ID</button>
        {/if}
        <button on:click={() => setParentID(node)}>Set Parent ID</button>
    </div>
    <button>Set Variable ID</button>
    <button>Set Conditional Boolean ID</button>
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang='postcss'>
    button {
        @apply mb-1 btn variant-filled-primary
    }
</style>