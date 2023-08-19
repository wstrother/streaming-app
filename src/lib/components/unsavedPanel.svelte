<script lang='ts'>
    import { layoutNodes, type LayoutNodeProxy } from "$lib/classes/layoutNodes"
    import { activeNodeID } from "$lib/stores/editor"

    let nodes: LayoutNodeProxy[]
    $: nodes = $layoutNodes.filter(n => n.unsaved)

    const reset = (node: LayoutNodeProxy|null) => {
        if (!node) return

        node.resetChanges()
    }

    const save = async (node: LayoutNodeProxy|null) => {
        if (!node) return

        await node.saveChangesToDB()
    }
    const saveAll = () => {nodes.forEach(n=>save(n))}
    const resetAll = () => {nodes.forEach(n=>reset(n))}
</script>

{#if nodes.length}
    <div id="unsaved-panel" 
        class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">

        <h1 class="h3 mb-2">Unsaved Changes:</h1>
        {#each nodes as node}
            <button 
                class="btn btn-sm mb-1 variant-ghost-primary" 
                on:click={() => activeNodeID.set(node.id)}>
                {node.key}
            </button>
        {/each}

        <div class="flex justify-around mt-2">
            <button on:click={saveAll}
                class="btn btn-sm variant-filled-primary">
                Save All
            </button>
            <button on:click={resetAll}
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