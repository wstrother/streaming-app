<script lang="ts">
	import { layoutNodes, type LayoutNodeProxy } from "$lib/classes/layoutNodes"
    import { getModalStore } from '@skeletonlabs/skeleton'
	import { onMount } from "svelte";
	import { fade, slide } from "svelte/transition";
    const modalStore = getModalStore()

    let parentNode: LayoutNodeProxy|null
    $: parentNode = $modalStore[0]?.meta?.parentNode ?? null

    let childNodes: LayoutNodeProxy[] = []
    $: {
        if (parentNode) childNodes = layoutNodes.getChildren($layoutNodes, parentNode)
    }

    const normalize = (nodes: LayoutNodeProxy[]) => {
        for (let i = 0; i < nodes.length; i++) {
            childNodes[i].saveChangesToProxy({"sibling_order": i + 1})
        }
    }
    onMount(() => {
        normalize(childNodes)
    })

    const moveUp = (node: LayoutNodeProxy) => {
        let index = childNodes.indexOf(node)
        if (index === 0) return

        let prev = childNodes[index - 1]
        let higher = node.sibling_order
        let lower = prev.sibling_order
        node.setColumn("sibling_order", lower)
        prev.setColumn("sibling_order", higher)
    }

    const moveDown = (node: LayoutNodeProxy) => {
        let index = childNodes.indexOf(node)
        if (index === childNodes.length - 1) return

        let next = childNodes[index + 1]
        let higher = next.sibling_order
        let lower = node.sibling_order
        node.setColumn("sibling_order", higher)
        next.setColumn("sibling_order", lower)
    }
</script>


<div class="variant-glass-primary rounded px-4 pb-2 text-white flex flex-col">
    <h1 class="h3 mb-2">Order Child Nodes</h1>

    {#each childNodes as node}
        <div class="bg-primary-500 rounded-full p-2 mb-2 flex justify-between items-center">
            {node.key}

            <div class="ml-2 btn-group bg-primary-600">
                <button on:click={() => moveDown(node)}>+</button>
                <button on:click={() => moveUp(node)}>-</button>
            </div>
        </div>
    {/each}
</div>