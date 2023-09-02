<script lang='ts'>
    import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import type { StateVariableProxy } from "$lib/classes/stateVariables"
	import SelectProxyButton from "./selectProxyButton.svelte"
    import { activeProxyID } from "$lib/stores/editor"

    export let proxies: LayoutNodeProxy[] | StateVariableProxy[]
    export let header: string = "Unsaved:"

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

        <h1 class="h3 mb-2">{header}</h1>
        {#each proxies as proxy}
            <SelectProxyButton proxy={proxy} 
                on:clickProxy={(e) => activeProxyID.set(e.detail.id)}
            />
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