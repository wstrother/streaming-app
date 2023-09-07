<script lang="ts">
    import { StateVariableProxy, stateVariables } from "$lib/classes/stateVariables"
    import { getModalStore } from '@skeletonlabs/skeleton'
	import type { MouseEventHandler } from "svelte/elements";
    const modalStore = getModalStore()

    let onClick: (sv: StateVariableProxy) => void|null
    $: onClick = $modalStore[0]?.meta?.onClick ?? null

    let onAdd: MouseEventHandler<HTMLButtonElement>|null
    $: onAdd = $modalStore[0]?.meta?.onAdd ?? null

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

    {#if onAdd}
    <button on:click={onAdd} class="variant-filled-secondary rounded-full p-2 mb-4">
        <span class="font-bold">Add New</span>
    </button>
    {/if}

    {#each filteredVars as sv}
        <button on:click={_ => _onClick(sv)}
            class="variant-filled-primary rounded-full 
            p-2 mb-2 flex justify-between items-center">
            <span class="font-bold mr-2">{sv.key}</span>{sv.value}
        </button>
    {/each}
</div>