<script>
    import { layoutNodes } from "$lib/stores/layouts";

    import LayoutNode from "$lib/components/layoutNode.svelte";

</script>


{#each $layoutNodes as node}
    <LayoutNode {node} />
{/each}
