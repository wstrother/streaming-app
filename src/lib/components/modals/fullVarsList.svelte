<script lang="ts">
    import { StateVariableProxy, stateVariables } from "$lib/classes/stateVariables"
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

    let onClick: Function|null
    $: onClick = $modalStore[0]?.meta?.onClick ?? null

    const _onClick = (sv: StateVariableProxy) => {
        if (onClick) onClick(sv)
        else modalStore.close()
    }

    let typeFilter: String
    $: typeFilter = $modalStore[0]?.meta?.typeFilter ?? ""

    let filteredVars: StateVariableProxy[]
    $: {
        if (typeFilter) filteredVars = $stateVariables.filter(sv => sv.type === typeFilter)
        else filteredVars = $stateVariables
    }
</script>

<div class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">
    <h1 class="h3 mb-2">State Variables</h1>

    {#each filteredVars as sv}
        <button on:click={(e) => _onClick(sv)}
            class="variant-filled-primary rounded-full 
            p-2 mb-2 flex justify-between items-center">
            <span class="font-bold mr-2">{sv.key}</span>{sv.value}
        </button>
    {/each}
</div>