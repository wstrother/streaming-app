<script lang='ts'>
    import { page } from "$app/stores"
    import { layoutTree } from "$lib/stores/layoutStore"
    import { activeNode, scalePercent } from "$lib/stores/editor.js"
	import type { LayoutNodeCls } from "$lib/classes/layoutTree.js"

    import streamBG from "$lib/images/stream-bg.png"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import ActiveNodePanel from "$lib/components/activeNodePanel.svelte"
    import ScalePanel from "$lib/components/scalePanel.svelte"
    import UnsavedPanel from "$lib/components/unsavedPanel.svelte"

    export let data
    let edit: boolean
    $: edit = data.edit
    
    const reset = () => {
        if ($activeNode) activeNode.set($activeNode?.resetChanges())
        $layoutTree.update()
    }

    const save = async () => {
        if ($activeNode) {
            const nodeSaved = await $activeNode?.saveChanges()
            activeNode.set(nodeSaved)
        }
        $layoutTree.update()
    }

    const getUnsaved = (): Array<LayoutNodeCls> => {
        return $layoutTree.nodes.filter(n => n.unsaved)
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
<div id="stream-layout-container" 
    style={edit ? `transform: scale(${$scalePercent}%)` : ''}>
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
        on:save_active={save}/>
        
    <ScalePanel />

    <UnsavedPanel />
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
</style>