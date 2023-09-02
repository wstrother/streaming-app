<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy"
	import { type LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"
    import { orderChildNodes, setBooleanID, setParentID, setVariableID, toggleBoolean, unsetBooleanID, unsetParentID, unsetVariableID } from "$lib/menuActions"
    import { getModalStore } from "@skeletonlabs/skeleton"
	import { stateVariables } from "$lib/classes/stateVariables";
    const modalStore = getModalStore()

    export let node: LayoutNodeProxy

    let attrs: ProxyAttrs = [
        'content',
        ['top', 'number'],
        ['left', 'number'],
        'classes',
        ['width', 'number'],
        ['height', 'number']
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
        <button on:click={() => orderChildNodes(node, modalStore)}>Order Child Nodes</button>
    </div>
    {/if}
    <div>
        <button on:click={() => setVariableID(node, modalStore)}>Set Variable ID</button>
        {#if node.variable_id}
            <button on:click={() => unsetVariableID(node)}>Unset Variable ID</button>
        {/if}
    </div>
    <div>
        <button on:click={() => setBooleanID(node, modalStore)}>Set Boolean ID</button>
    </div>
    {#if node.boolean_key}
    <div>
        <button 
            on:click={() => toggleBoolean(node, stateVariables)}>
            Toggle Boolean
        </button>
        <button on:click={() => unsetBooleanID(node)}>Unset Boolean ID</button>
    </div>
    {/if}
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