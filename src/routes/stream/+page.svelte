<script>
    import { layoutNodes } from "$lib/stores/layouts";
    import { stateVariables } from '$lib/stores/vars';

    // import LayoutNode from "$lib/components/layoutNode.svelte";

</script>


{#each $layoutNodes as node}
    <!-- <LayoutNode {node} /> -->
    <p>{node.key}</p>
{/each}


{#each $stateVariables as sv}
    <p>{sv.key}</p>
{/each}