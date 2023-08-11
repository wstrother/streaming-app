<script lang='ts'>
    import { layoutNodes, type LayoutNodeProxy } from "$lib/classes/layoutNodes"
    import { activeNode } from "$lib/stores/editor"
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    let nodes: LayoutNodeProxy[]
    $: nodes = $layoutNodes.filter(n => n.unsaved)
</script>

{#if nodes.length}
    <div id="unsaved-panel" 
        class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">

        <h1 class="h3 mb-2">Unsaved Changes:</h1>
        {#each nodes as node}
            <button 
                class="btn btn-sm mb-1 variant-ghost-primary" 
                on:click={() => activeNode.set(node)}>
                {node.key}
            </button>
        {/each}

        <div class="flex justify-around mt-2">
            <button on:click={() => dispatch('save_all')}
                class="btn btn-sm variant-filled-primary">
                Save All
            </button>
            <button on:click={() => dispatch('reset_all')}
                class="btn btn-sm variant-filled-primary">
                Reset All
            </button>
        </div>
    </div>
{/if}

<style>
    #unsaved-panel {
        position: absolute;
        z-index: 2;
        right: 100px;
        bottom: 100px;
    }
</style>