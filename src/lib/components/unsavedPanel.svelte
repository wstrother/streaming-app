<script lang='ts'>
    import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import type { StateVariableProxy } from "$lib/classes/stateVariables"
    // import { activeNodeID } from "$lib/stores/editor"
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    export let proxies: LayoutNodeProxy[] | StateVariableProxy[]

    const reset = (proxy: LayoutNodeProxy|StateVariableProxy|null) => {
        if (!proxy) return

        proxy.resetChanges()
    }

    const save = async (proxy: LayoutNodeProxy|StateVariableProxy|null) => {
        if (!proxy) return

        await proxy.saveChangesToDB()
    }
    const saveAll = () => {proxies.forEach(n=>save(n))}
    const resetAll = () => {proxies.forEach(n=>reset(n))}
</script>

{#if proxies.length}
    <div id="unsaved-panel" 
        class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">

        <h1 class="h3 mb-2">Unsaved Changes:</h1>
        {#each proxies as proxy}
            <button 
                class="btn btn-sm mb-1 variant-ghost-primary" 
                on:click={() => dispatch('clickProxy', proxy)}>
                {proxy.key}
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