<script lang="ts">
    import type { StateVarValue } from '$lib/classes/dbProxy';
    import { layoutNodes, type LayoutNodeProxy } from '$lib/classes/layoutNodes'
    import { stateVariables } from '$lib/classes/stateVariables'
    import { activeProxyID, ctxMenu, scalePercent, type CtxMenu, type CtxMenuItem } from '$lib/stores/editor'
	import { setParentID, unsetParentID } from '$lib/menuActions'
    import { page } from '$app/stores'

    import { getModalStore } from "@skeletonlabs/skeleton"
    const modalStore = getModalStore()
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    
    export let node: LayoutNodeProxy
    export let edit: boolean
    export let child: boolean = false
    export let depth: number = 0

    let imgURL: string 
    $: imgURL = `${$page.data.imageBaseUrl}/${node.user_id}/${node.image}`

    let display: StateVarValue = true
    $: if (node.boolean_id) {
        display = stateVariables.getVarByID($stateVariables, node.boolean_id)
    }

    // handle var values / interpolation
    const varValue = stateVariables.getVarStore(node.variable_id)
    let content: string
    $: content = node.interpolate(
        (key: string) => stateVariables.getVarByKey($stateVariables, key)
    )
    
    // handle movement / positioning
    let moving: boolean = false
    let moveFactor: number = 1
    $: moveFactor = 1 / ($scalePercent / 100)

    function isClicked(e: MouseEvent) {
        if (edit) {
            activeProxyID.set(node.id)
            startMovement()
        }
	}
	
    function startMovement() {
        if (edit) {
            if (!child) moving = true
            else dispatch('dragParent')
        }
    }

	function stopMovement() {
		moving = false
	}
	
	function move(e: MouseEvent) {
        if (moving) {
            node.move(e.movementX * moveFactor, e.movementY * moveFactor)
        }
	}

    const getMenu = (): CtxMenu => {
        const menu: CtxMenuItem[] = [
            {key: `Save ${node.key}`, 
                disabled: !node.unsaved, 
                action: () => node.saveChangesToDB()},
            {key: `Reset ${node.key}`, 
                disabled: !node.unsaved, 
                action: () => node.resetChanges()},
            {key: ''},
            {key: 'Set Parent ID', action: () => setParentID(node, modalStore)}
        ]

        if (node.parent_node_id) {
            menu.push(
                {key: 'Unset Parent ID', action: () => unsetParentID(node)},
                {key: 'Select Parent',
                    action: () => activeProxyID.set(node.parent_node_id)
                })
        }

        menu.push(
            {key: 'Add New Child Node', action: () => dispatch('addChildNode', node)},
            {key: ''},
            {key: `Delete ${node.key}`, action: () => dispatch('deleteNode', node)}
        )

        return menu
    }

    let childNodes: LayoutNodeProxy[]
    $: childNodes = layoutNodes.getChildren($layoutNodes, node)
</script>

<svelte:window on:mouseup={stopMovement} on:mousemove={move}  />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
    on:contextmenu|stopPropagation|preventDefault={e => ctxMenu.open(e, getMenu())}
    on:mousedown|preventDefault|stopPropagation={isClicked} 
    id="layoutNode-{node.key}"

    style:top={`${node.top}px`}
    style:left={`${node.left}px`}
    style:width={node.width ? `${node.width}px` : null}
    style:height={node.height ? `${node.height}px` : null}
    style:background-image={node.image ? `url(${imgURL})` : null}
    style:display={!display ? 'none' : null}

    class="{node.classes} layout-node
        select-none cursor-pointer"
    class:absolute={!child}
    class:layout-node-active={$activeProxyID === node.id}
    class:layout-node-edit={edit}
>
    {#if content}
        <span class="layout-node-content">
            {content ?? ''}
        </span>
    {/if}

    {#if node.variable_id}
        <span class="layout-node-var">
            {$varValue}
        </span>
    {/if}

    {#each childNodes as child}
        <svelte:self 
            node={child} 
            {edit} 
            child={true} 
            depth={depth + 1}
            on:dragParent={startMovement}
            on:deleteNode
            on:addChildNode
        />
    {/each}
</div>