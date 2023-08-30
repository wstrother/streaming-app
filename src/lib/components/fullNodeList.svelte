<script lang="ts">
    import { LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
    import { activeNodeID } from "$lib/stores/editor"

    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

    export let root: boolean = true
    export let children: LayoutNodeProxy[] = []

    const close = () => modalStore.close()
</script>

{#if root}
    <div id="full-nodes-panel" 
    class="bg-primary-600 rounded px-4 pb-2 text-white flex flex-col">

        <h1 class="h3 mb-2">Layout Nodes</h1>

        {#each $layoutNodes.filter(n => !n.parent_node_id) as node}
            <button class="btn-style" on:dblclick={close}  on:click={() => activeNodeID.set(node.id)}>
                {node.key}
                {#if node.client}
                <span class="pl-2 italic">(new)</span>
                {/if}
            </button>
            
            {#if node.children.length}
                <div class="container">
                    <svelte:self root={false} children={node.children}/>
                </div>
            {/if}         
        {/each}
    </div>
{:else}
    {#each children as node}
        <button class="btn-style" on:dblclick={close}  on:click={() => activeNodeID.set(node.id)}>
            {node.key}
            {#if node.client}
            <span class="pl-2 italic">(new)</span>
            {/if}
        </button>
        
        {#if node.children.length}
            <div class="container">
                <svelte:self children={node.children} root={false} />
            </div>
        {/if}
    {/each}
{/if}

<style lang="postcss">
    :global(.btn-style) {
        @apply btn btn-sm mb-1 variant-ghost-primary
    }

    .container {
        @apply border-2 rounded p-1 mb-4 mt-0 
            border-primary-500 bg-primary-600 flex flex-col ml-4
            border-t-0 border-r-0
    }
</style>