<script lang='ts'>
    import { page } from "$app/stores"
    import { layoutTree } from "$lib/stores/layoutStore"
    import { activeNode, scalePercent } from "$lib/stores/editor.js"

    import LayoutNode from "$lib/components/layoutNode.svelte"
    import ActiveNodePanel from "$lib/components/activeNodePanel.svelte"
    import streamBG from "$lib/images/stream-bg.png"
    import { RangeSlider } from '@skeletonlabs/skeleton'

    export let data
    let edit: boolean
    $: edit = data.edit
    
    const reset = () => {
        if ($activeNode) activeNode.set($activeNode?.resetChanges())
        $layoutTree.update()
    }

    const save = async () => {
        if ($activeNode) {
            const node = await $activeNode?.saveChanges()
            activeNode.set(node)
        }
        $layoutTree.update()
    }
</script>

<!-- 'Edit Layout' panel for switching to edit mode -->
{#if !edit}
    <div id="open-editor-panel">
        <a 
            href={`${$page.url.pathname}/edit`} 
            class="bg-primary-500 p-4 h5 text-white m-4">
            Edit Layout
        </a>
    </div>
{/if}

<!-- Optional stream bg and layout node tree -->
<div id="stream-layout-container" style={`transform: scale(${$scalePercent}%)`}>
    {#if streamBG && edit}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src={streamBG} alt="stream bg" on:mousedown={(e) => {e.preventDefault(); activeNode.set(null)}}/>
    {/if}

    {#each $layoutTree.nodes as node}
        <LayoutNode {node} {edit}/>
    {/each}
</div>

<!-- Beginning of actual edit UI elements -->
{#if edit}
    <ActiveNodePanel 
        on:reset_active={reset}
        on:save_active={save}
        node={$activeNode}/>
        
    <div id="scale-slider-container" 
    class="absolute m-4 bottom-0 w-[200px] variant-glass-primary p-4 rounded">
        <RangeSlider 
            name="scale-slider"
            label="scale-slider"
            accent="accent-primary-500"
            bind:value={$scalePercent} 
            max={100} min={25} step={5}>
            <div class="flex justify-between items-center text-white">
                <div class="font-bold">Scale</div>
                <div class="text-xs">{$scalePercent}%</div>
            </div>
        </RangeSlider>
    </div>
{/if}

<style>
    #open-editor-panel {
        z-index: 2;
        opacity: 0;
        position: absolute;
    }
    #open-editor-panel:hover {
        opacity: 1;
    }

    #stream-layout-container {
        transform-origin: top left;
    }

    #stream-layout-container img {
        min-width: 1920px;
        min-height: 1080px;
        user-select: none;
        z-index: -5;
    }

    #scale-slider-container {opacity: 0;}
    #scale-slider-container:hover {opacity: 1;}
</style>