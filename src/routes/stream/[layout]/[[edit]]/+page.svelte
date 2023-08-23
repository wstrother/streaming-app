<script lang='ts'>
    import { page } from "$app/stores"
    import { activeNodeID, scalePercent } from "$lib/stores/editor.js"
    import { layoutNodes, type LayoutNodeProxy } from "$lib/classes/layoutNodes.js"

    import streamBG from "$lib/images/stream-bg.png"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import EditNodePanel from "$lib/components/edit/editNodePanel.svelte"
    import ScalePanel from "$lib/components/scalePanel.svelte"
    import UnsavedPanel from "$lib/components/unsavedPanel.svelte"
    import { wheel } from "$lib/stores/editor.js"
	import ContextMenu from "$lib/components/contextMenu.svelte";

    export let data
    let edit: boolean
    $: edit = data.edit

    let activeNode: LayoutNodeProxy | null 
    $: activeNode = layoutNodes.getNodeByID($layoutNodes, $activeNodeID)

    const unselectNode = () => {
        if (edit) activeNodeID.set(null)
    }

</script>

<ContextMenu />


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
    {#if streamBG && edit && !$page.data.inOBS}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src={streamBG} alt="stream bg" on:mousedown|preventDefault={() => unselectNode()}/>
    {/if}

    {#each $layoutNodes.filter(n => !n.parent_node_id) as node}
        <LayoutNode {node} {edit}/>
    {/each}
</div>

<!-- Beginning of actual edit UI elements -->
{#if edit}

    <div id="active-node-panel">
        {#if activeNode}
            <EditNodePanel proxy={activeNode} />
        {/if}
    </div>
        
    <ScalePanel />

    <UnsavedPanel header="Unsaved Layout Nodes:"
        on:clickProxy={({detail}) => activeNodeID.set(detail.id)}
        proxies={$layoutNodes.filter(n => n.unsaved)}/>
{/if}

<style lang="postcss">
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

    #active-node-panel {
        @apply absolute top-0 right-0
    }
</style>