<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy"
	import { type LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"
    import { orderChildNodes, setParentID, unsetParentID } from "$lib/menuActions"
    import { getModalStore } from "@skeletonlabs/skeleton"
    const modalStore = getModalStore()

    export let node: LayoutNodeProxy

    let attrs: ProxyAttrs = [
        'content',
        ['top', 'number'],
        ['left', 'number'],
        'classes',
        ['width', 'number'],
        ['height', 'number'],
        ["sibling_order", "number"]
    ]

    let childNodes: LayoutNodeProxy[]
    $: childNodes = layoutNodes.getChildren($layoutNodes, node)
</script>

<EditProxyPanel proxy={node} {attrs}/>

<div class="variant-glass-primary m-4 rounded p-3 text-white flex flex-col actions-panel">
    <div>
        <button on:click={() => setParentID(node, modalStore)}>Set Parent ID</button>
        {#if node.parent_node_id}
            <button on:click={() => unsetParentID(node)}>Unset Parent ID</button>
        {/if}
    </div>
    {#if childNodes.length}
    <div>
        <button on:click={() => orderChildNodes(childNodes, modalStore)}>Order Child Nodes</button>
    </div>
    {/if}
    <div>
        <button>Set Variable ID</button>
        {#if node.variable_id}
            <button >Unset Variable ID</button>
        {/if}
    </div>
    <div>
        <button>Set Boolean ID</button>
        {#if node.boolean_id}
            <button >Unset Boolean ID</button>
        {/if}
    </div>
    <div>
        <button>Set Image</button>
        {#if node.image}
            <button >Unset Image</button>
        {/if}
    </div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang='postcss'>
    button {
        @apply mb-1 btn variant-filled-primary w-[100%]
    }

    .actions-panel div {
        @apply flex justify-between
    }
</style>