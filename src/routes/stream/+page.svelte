<script lang='ts'>
    import { layoutTree } from "$lib/stores/layoutStore"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import streamBG from "$lib/images/stream-bgg.png"

</script>
<div id="stream-layout-container">
    {#if streamBG }
        <img src={streamBG} alt="stream bg" />
    {/if}
    
    {#each $layoutTree.nodes as node}
        <LayoutNode {node} />
    {/each}
</div>

<style>
    #stream-layout-container {
        display: block;
        /* transform: scale(75%); */
        transform-origin: top left;
    }

    #stream-layout-container img {
        min-width: 1920px;
        min-height: 1080px;
        user-select: none;
    }
</style>