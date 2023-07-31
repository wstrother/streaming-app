<script>
    import { layoutNodes } from "$lib/stores/layouts";
    import { stateVariables } from '$lib/stores/vars';

    // import LayoutNode from "$lib/components/layoutNode.svelte";

</script>


<h1 class='h3'>Layout Nodes</h1>
{#each $layoutNodes as node}
    <!-- <LayoutNode {node} /> -->
    <p>{node.key}</p>
{/each}

<p>&nbsp;</p>

<h1 class='h3'>State Vars</h1>
{#each $stateVariables as sv}
    <p>{sv.key}</p>
{/each}