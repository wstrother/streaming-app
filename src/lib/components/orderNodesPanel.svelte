<script lang="ts">
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

    let childNodes: LayoutNodeProxy[] = []
    $: childNodes = $modalStore[0]?.meta?.childNodes ?? []
</script>


<div class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">
    <h1 class="h3 mb-2">Order Child Nodes</h1>

    {#each childNodes as node}
        <div>{node.key}</div>
    {/each}
</div>