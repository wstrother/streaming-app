<script lang="ts">
    import { layoutNodes } from "$lib/classes/layoutNodes"
	import SelectProxyButton from "./selectProxyButton.svelte"

    import { activeProxyID } from "$lib/stores/editor"
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()
</script>

<div id="full-nodes-panel" 
    class="bg-primary-600 rounded px-4 pb-2 text-white flex flex-col">

    <h1 class="h3 mb-2">Layout Nodes</h1>

    {#each $layoutNodes.filter(n => !n.parent_node_id) as node}
        <SelectProxyButton proxy={node} tree={true}
            on:clickProxy={(e) => activeProxyID.set(e.detail.id)}
            on:dblclickProxy={() => modalStore.close()}
        />
    {/each}
</div>
