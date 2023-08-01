<script>
    import { layoutNodes } from "$lib/stores/layouts";
    import LayoutNode from "$lib/components/layoutNode.svelte";

    import streamBG from "$lib/images/twitchbg.png"
</script>
<div id="stream-layout-container">
    <img 
        draggable="false"
        src={streamBG} 
        alt="stream background"/>
    
    {#each $layoutNodes as node}
        <LayoutNode {node} />
    {/each}
</div>

<style>
    #stream-layout-container {
        display: block;
        transform: scale(75%);
        transform-origin: top left;
    }

    #stream-layout-container img {
        width: 1920px;
        height: 1080px;
        user-select: none;
    }
</style>