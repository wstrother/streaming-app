<script lang="ts">
    import { LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
	import type { StateVariableProxy } from "$lib/classes/stateVariables";

    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    export let proxy: LayoutNodeProxy | StateVariableProxy
    export let tree: boolean = false
    export let disabled: Number[] = []

    let children: LayoutNodeProxy[] = []
    if (proxy instanceof LayoutNodeProxy) children = layoutNodes.getChildren($layoutNodes, proxy)
</script>


<button class="btn btn-sm variant-filled-primary mb-1"
    disabled={disabled.includes(proxy.id ?? 0)}
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
            <svelte:self proxy={child} tree={true} {disabled}
                on:clickProxy on:dblclickProxy/>
        {/each}
    </div>
{/if}

<style lang="postcss">
    .container {
        @apply border-2 rounded p-1 mb-4 mt-0 
            border-primary-500 variant-glass-primary flex flex-col ml-4
            border-t-0 border-r-0
    }
</style>