<script lang="ts">
    import { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import type { StateVariableProxy } from "$lib/classes/stateVariables";

    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    export let proxy: LayoutNodeProxy | StateVariableProxy
    export let tree: boolean = false

    let children: LayoutNodeProxy[] = []
    if (proxy instanceof LayoutNodeProxy) children = proxy.children
</script>


<button class="btn-style" 
    on:dblclick={() => dispatch("dblclickProxy", proxy)}  
    on:click={() => dispatch("clickProxy", proxy)}>

    {proxy.key}
    {#if proxy.client}
        <span class="pl-2 italic">(new)</span>
    {/if}
</button>

{#if children && children.length && tree}
    <div class="container">
        {#each children as child}
            <svelte:self proxy={child} tree={true}/>
        {/each}
    </div>
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