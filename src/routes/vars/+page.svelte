<script lang="ts">
    import { StateVariableProxy, stateVariables } from "$lib/classes/stateVariables"
	import EditVarPanel from "$lib/components/edit/editVarPanel.svelte"
	import UnsavedPanel from "$lib/components/unsavedPanel.svelte"
    import { activeProxyID } from "$lib/stores/editor"

    let activeVar: StateVariableProxy | null
    $: {
        if ($activeProxyID) activeVar = stateVariables.getProxyByID($stateVariables, $activeProxyID)
        else activeVar = null
    }
</script>

<div id="vars-container">
    {#each $stateVariables as sv}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="bg-primary-600 rounded p-2 mb-1 text-white h4 flex justify-between">
            
            <span>{sv.key}: {sv.value}</span>
            
            <button class="btn btn-sm variant-filled-primary" 
                on:click={() => activeProxyID.set(sv.id)}>
                Edit
            </button>
        </div>
    {/each}
</div>

{#if activeVar}
    <div id="active-var-panel">
        <EditVarPanel proxy={activeVar} />
    </div>
{/if}

<UnsavedPanel header="Unsaved State Variables:" 
    on:clickProxy={({detail}) => activeProxyID.set(detail.id)}
    proxies={$stateVariables.filter(sv => sv.unsaved)} />


<style lang='postcss'>
    #vars-container {
        @apply m-4;
        width: 500px;
        z-index: 0;
        position: absolute;
    }

    #active-var-panel {
        @apply absolute top-[30px] right-0
    }
</style>