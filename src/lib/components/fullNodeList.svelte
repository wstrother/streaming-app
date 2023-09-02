<script lang="ts">
    import { layoutNodes } from "$lib/classes/layoutNodes"
	import SelectProxyButton from "./selectProxyButton.svelte"

    import { activeProxyID } from "$lib/stores/editor"
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

    let onClick: Function|null, onDblClick: Function|null
    $: onClick = $modalStore[0]?.meta?.onClick ?? null
    $: onDblClick = $modalStore[0]?.meta?.onDblClick ?? null

    const _onClick = (e: CustomEvent) => {
        if (onClick) onClick(e)
        else activeProxyID.set(e.detail.id)
    }

    const _onDblClick = (e: CustomEvent) => {
        if (onDblClick) onDblClick(e)
        else modalStore.close()
    }

    let disabled: Number[] = []
    $: disabled = $modalStore[0]?.meta?.exclude ?? []
</script>

<div id="full-nodes-panel" 
    class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">

    <h1 class="h3 mb-2">Layout Nodes</h1>

    {#each $layoutNodes.filter(n => !n.parent_node_id) as node}
        <SelectProxyButton proxy={node} tree={true} {disabled}
            on:clickProxy={_onClick}
            on:dblclickProxy={_onDblClick}
        />
    {/each}
</div>
