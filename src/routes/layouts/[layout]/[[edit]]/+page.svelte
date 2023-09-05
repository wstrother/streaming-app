<script lang='ts'>
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()
    let modalOpen: boolean
    $: modalOpen = Boolean($modalStore.length)

    import { page } from "$app/stores"
    import { activeProxyID, ctxMenu, scalePercent, type CtxMenu } from "$lib/stores/editor.js"
    import { layoutNodes, LayoutNodeProxy } from "$lib/classes/layoutNodes.js"
    import { wheel } from "$lib/stores/editor.js"

    import streamBG from "$lib/images/stream-bg.png"
    import LayoutNode from "$lib/components/layoutNode.svelte"
    import EditNodePanel from "$lib/components/edit/editNodePanel.svelte"
    import ScalePanel from "$lib/components/scalePanel.svelte"
    import UnsavedPanel from "$lib/components/unsavedPanel.svelte"
    import ContextMenu from '$lib/components/menu/contextMenu.svelte'
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

    export let data
    let { supabase, user, edit } = data
	$: ({ supabase, user, edit } = data)

    let activeNode: LayoutNodeProxy|null
    $: activeNode = layoutNodes.getNodeByID($layoutNodes, $activeProxyID)
    
    let rootNodes: LayoutNodeProxy[], unsavedNodes: LayoutNodeProxy[]
    $: rootNodes = $layoutNodes.filter(n => !n.parent_node_id)
    $: unsavedNodes = $layoutNodes.filter(n => n.unsaved)

    const openNodeList = () => {
        modalStore.trigger({type: 'component', component: 'fullNodeList'})
    }

    const unselectNode = () => {
        if (edit) activeProxyID.set(null)
    }

    const addNode = (parent_node_id:number|null=null) => {
        modalStore.trigger({
            type: 'prompt',
            title: 'Enter Name',
            body: 'Provide a unique key to identify this node by',
            value: 'new_node',
            valueAttr: { type: 'text', minlength: 1, required: true },

            response: (key: string) => {
                if (!key) return
                if (!user.id) throw Error("No User ID found in current userMeta")

                layoutNodes.add($layoutNodes, {
                    key, 
                    user_id: user.id, 
                    layout_id: $page.data.layoutData.id,
                    parent_node_id,
                    classes: parent_node_id ? "" : "absolute"
                })
            }
        })
    }

    const deleteNode = (e: CustomEvent) => {
        const nodeToDelete = e.detail as LayoutNodeProxy
        modalStore.trigger({
            type: 'confirm',
            title: `Delete ${nodeToDelete.key}?`,
            body: 'Confirm you want to delete this node. This is not reversible!',
            response: (r: boolean) => {
                if (!r) return
                else layoutNodes.delete($layoutNodes, nodeToDelete)
            }
        })
    }

    const getMenu = (): CtxMenu => ([
        {key: "Save All",     
            disabled: !unsavedNodes.length, 
            action: () => unsavedNodes.forEach(n => n.saveChangesToDB(supabase))
        },
        {key: "Reset All",    
            disabled: !unsavedNodes.length, 
            action: () => unsavedNodes.forEach(n => n.resetChanges())
        },
        {key: "Add New Node", action: addNode},
        {key: "Open Node List", action: openNodeList}
    ])
</script>
<svelte:window 
    on:click={ctxMenu.close} 
    on:contextmenu|preventDefault={(e) => {if (!modalOpen) ctxMenu.open(e, getMenu())}}
/>
<ContextMenu />

<!-- 'Edit Layout' panel for switching to edit mode -->
{#if !edit}
    <div id="open-editor-panel">
        <a 
            href={`${$page.url.pathname}/edit`} 
            class="bg-primary-500 p-4 h5 text-white m-4 rounded">
            Edit Layout
        </a>
    </div>
{/if}

<!-- layout node tree -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="stream-layout-container" 
    on:wheel={wheel}
    style={edit ? `transform: scale(${$scalePercent}%)` : ''}>

    <!-- Optional stream bg  -->
    {#if streamBG && edit && !$page.data.inOBS}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img src={streamBG} alt="stream bg" 
            on:click={unselectNode}
            on:contextmenu|preventDefault
        />
    {/if}

    <!-- Beginning of layout node elements -->
    {#each rootNodes as node}
        <LayoutNode {node} {edit} 
            on:addChildNode={(e) => addNode(e.detail.id)}
            on:deleteNode={(e) => deleteNode(e)}/>
    {/each}
</div>

<!-- Beginning of actual edit UI elements -->
{#if edit}

    <div id="active-node-panel">
        {#if activeNode}
            <EditNodePanel node={activeNode} />
        {/if}
    </div>
        
    <ScalePanel />

    <UnsavedPanel header="Unsaved Layout Nodes:"
        on:clickProxy={({detail}) => activeProxyID.set(detail.id)}
        proxies={unsavedNodes}/>
    
    <div id="open-node-list-panel" 
        class="variant-glass-primary rounded p-4 text-white m-4">
        
        <button on:click={openNodeList}
            class="btn btn-sm mb-1 variant-ghost-primary">
            Open Node List
        </button>
    </div>
{/if}

<style lang="postcss">
    #open-editor-panel {
        z-index: 2;
        opacity: 0;
        position: absolute;
        @apply mt-2;
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
        @apply absolute top-0 right-0 md:mr-20 sm:mr-2 w-[400px]
    }

    #open-node-list-panel {
        position: absolute;
        z-index: 2;
        right: 100px;
        bottom: 0;
        opacity: 0;
    }
    #open-node-list-panel:hover {
        opacity: 1
    }
</style>