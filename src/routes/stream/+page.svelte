<script lang='ts'>
    import { layoutNodes, type LayoutNode as LayoutNodeT } from "$lib/stores/layoutNodes"
    import { activeNode } from "$lib/stores/editor"
    import Mouse from "$lib/stores/mouse"
    
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import streamBG from "$lib/images/twitchbg.png"
    
    const { mousePosition, mouseHeld } = Mouse
    let [activeNodeX, activeNodeY] = [0, 0]
    let [originMouseX, originMouseY] = [0, 0]

    const setActive = (n: LayoutNodeT) => {
        activeNode.set(n)
        activeNodeX = n.left
        activeNodeY = n.top
        originMouseX = $mousePosition.x
        originMouseY = $mousePosition.y
    }
    const unsetActive = () => {
        activeNode.set(null)
    }

    $: if ($mouseHeld && $activeNode) {
        console.log('moving')
        let [dx, dy] = [
            $mousePosition.x - originMouseX, 
            $mousePosition.y - originMouseY
        ]
        $activeNode.left = activeNodeX + dx
        $activeNode.top = activeNodeY + dy
    }
    

</script>
<div id="stream-layout-container">
    <img 
    draggable="false"
    src={streamBG} 
    alt="stream background"/>
    
    {#each $layoutNodes as node}
    <LayoutNode 
    {node} 
    on:mouseover={(e) => setActive(e.detail.node)}
    on:mouseleave={(e) => unsetActive()}
    />
    {/each}
</div>
{ [$mousePosition.x, $mousePosition.y] } / { $mouseHeld } / { $activeNode?.key ?? '' }

<style>
    #stream-layout-container {
        display: block;
        /* transform: scale(75%); */
        transform-origin: top left;
    }

    #stream-layout-container img {
        width: 1920px;
        height: 1080px;
        user-select: none;
    }
</style>