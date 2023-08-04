<script lang='ts'>
    import { layoutTree } from "$lib/stores/layoutStore"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import streamBG from "$lib/images/stream-bg.png"
    import { page } from "$app/stores"
    console.log()

    export let data
    let edit: boolean
    $: edit = data.edit

</script>

<div id="stream-layout-container">
    {#if !edit}
        <div class="open-editor-panel">
            <a 
                href={`${$page.url.pathname}/edit`} 
                class="bg-primary-500 p-4 h5 text-white m-4">
                Edit Layout
            </a>
        </div>
    {/if}

    {#if streamBG && edit}
        <img src={streamBG} alt="stream bg" />
    {/if}

    {#each $layoutTree.nodes as node}
        <LayoutNode {node} {edit}/>
    {/each}
</div>

<style>
    .open-editor-panel {
        z-index: 2;
        opacity: 0;
        position: absolute;
    }
    .open-editor-panel:hover {
        opacity: 1;
    }

    #stream-layout-container {
        display: block;
        /* transform: scale(75%); */
        transform-origin: top left;
    }

    #stream-layout-container img {
        min-width: 1920px;
        min-height: 1080px;
        user-select: none;
        z-index: -5;
    }
</style>