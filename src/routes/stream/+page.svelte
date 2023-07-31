<script>
    import { layoutNodes } from "$lib/stores/layouts";
    import { stateVariables } from '$lib/stores/vars';

    import LayoutNode from "$lib/components/layoutNode.svelte";

    $: console.log($stateVariables)

</script>

<!-- 
{#each $layoutNodes as node}
    <LayoutNode {node} />
{/each} -->

{#each $stateVariables as sv}
    <p>{sv.key}</p>
{/each}