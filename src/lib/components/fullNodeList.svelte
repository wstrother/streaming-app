<script lang="ts">
    import { layoutNodes } from "$lib/classes/layoutNodes"
    import { activeNodeID } from "$lib/stores/editor"

    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

</script>

<div id="unsaved-panel" 
class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">

    <h1 class="h3 mb-2">Layout Nodes</h1>
    {#each $layoutNodes.filter(n => !n.parent_node_id) as node}
        <button 
            class="btn btn-sm mb-1 variant-ghost-primary"
            on:dblclick={() => modalStore.close()} 
            on:click={() => activeNodeID.set(node.id)}>
            {node.key}
            {#if node.client}
                <span class="pl-2 italic">(new)</span>
            {/if}
        </button>
        
    {/each}
</div>
