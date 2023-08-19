<script lang="ts">
    import { StateVariableProxy, stateVariables } from "$lib/classes/stateVariables"
	import EditProxyPanel from "$lib/components/editProxyPanel.svelte"
	import UnsavedPanel from "$lib/components/unsavedPanel.svelte"
    import { activeVarId } from "$lib/stores/editor"

    let activeVar: StateVariableProxy | null 
    $: activeVar = stateVariables.getVarById($stateVariables, $activeVarId)

</script>


<div id="vars-container">

    {#each $stateVariables as sv}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="bg-primary-500 rounded-sm p-2 mb-1 text-white h4 flex justify-between">
            
            <span>{sv.key}: {sv.value}</span>
            
            <button class="btn btn-sm variant-filled-primary" 
                on:click={() => activeVarId.set(sv.id)}>
                Edit
            </button>
        </div>
    {/each}
</div>

{#if activeVarId}  
    <div id="active-var-panel">
        <EditProxyPanel proxy={activeVar} attrs={['key', 'value']} />
    </div>
{/if}

<UnsavedPanel header="Unsaved State Variables:" 
    on:clickProxy={({detail}) => activeVarId.set(detail.id)}
    proxies={$stateVariables.filter(sv => sv.unsaved)} />


<style lang='postcss'>
    #vars-container {
        @apply m-4;
        width: 500px;
        z-index: 0;
        position: absolute;
    }

    #active-var-panel {
        @apply absolute top-0 right-0
    }
</style>