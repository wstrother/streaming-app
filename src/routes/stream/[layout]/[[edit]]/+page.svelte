<script lang='ts'>
    import { page } from "$app/stores"
    import { activeNode, scalePercent } from "$lib/stores/editor.js"
    import { layoutNodes, type LayoutNodeCls } from "$lib/classes/layoutTree.js"

    import streamBG from "$lib/images/stream-bg.png"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import ActiveNodePanel from "$lib/components/activeNodePanel.svelte"
    import ScalePanel from "$lib/components/scalePanel.svelte"
    import UnsavedPanel from "$lib/components/unsavedPanel.svelte"
    import { wheel } from "$lib/stores/editor.js"

    export let data
    let edit: boolean
    $: edit = data.edit

    const unselectNode = () => {
        if (edit) activeNode.set(null)
    }
    
    const reset = (node: LayoutNodeCls|null) => {
        if (!node) return

        const nodeReset = node.resetChanges()
        if ($activeNode?.id === node.id) activeNode.set(nodeReset)
    }

    const save = async (node: LayoutNodeCls|null) => {
        if (!node) return

        const nodeSaved = await node.saveChanges()
        if ($activeNode?.id === node.id) activeNode.set(nodeSaved)
    }

    let unsavedNodes: Array<LayoutNodeCls>
    $: unsavedNodes = $layoutNodes.filter(n=>n.unsaved)
    const saveAll = () => {unsavedNodes.forEach(n=>save(n))}
    const resetAll = () => {unsavedNodes.forEach(n=>reset(n))}

    
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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="stream-layout-container" 
    on:wheel={wheel}
    style={edit ? `transform: scale(${$scalePercent}%)` : ''}>
    {#if streamBG && edit}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src={streamBG} alt="stream bg" on:mousedown|preventDefault={() => unselectNode()}/>
    {/if}

    {#each $layoutNodes as node}
        <LayoutNode {node} {edit}/>
    {/each}
</div>

<!-- Beginning of actual edit UI elements -->
{#if edit}
    <ActiveNodePanel 
        on:reset_active={() => reset($activeNode)}
        on:save_active={() => save($activeNode)}/>
        
    <ScalePanel />

    <UnsavedPanel 
        on:reset_all={resetAll}
        on:save_all={saveAll}
    />
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