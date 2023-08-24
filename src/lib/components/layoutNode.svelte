<script lang="ts">
    import type { LayoutNodeProxy } from '$lib/classes/layoutNodes'
    import { stateVariables } from '$lib/classes/stateVariables'
    import { activeNodeID, scalePercent } from '$lib/stores/editor'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    
    export let node: LayoutNodeProxy
    export let edit: boolean
    export let child: boolean = false
    export let depth: number = 0

    // handle var values / interpolation
    const varValue = stateVariables.getVarStore(node.variable_id)
    const interpVars = (key: string) => stateVariables.getVarByKey($stateVariables, key)
    let content: string
    $: content = node.interpolate(interpVars)

    // set up positional CSS
    let posCSS: string, wCSS: string, hCSS: string, inlineCSS: string
    $: posCSS = `top: ${node.top}px; left: ${node.left}px;`
    $: wCSS = node.width ? `width: ${node.width}px;` : ''
    $: hCSS = node.height ? `height: ${node.height}px;` : ''
    $: inlineCSS = `${posCSS}${wCSS}${hCSS}`
    
    // handle movement / positioning
    let moving: boolean = false
    let moveFactor: number = 1
    $: moveFactor = 1 / ($scalePercent / 100)

    function isClicked(e: MouseEvent) {
        if (edit) {
            activeNodeID.set(node.id)
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

</script>

<svelte:window on:mouseup={stopMovement} on:mousemove={move}  />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
    on:contextmenu|stopPropagation|preventDefault
    on:mousedown|preventDefault|stopPropagation={isClicked} 
    id="layoutNode-{node.key}"
    style={inlineCSS}
    class="{node.classes}
        min-w-content
        min-h-content
        select-none
        cursor-pointer
        {edit ? 'layout-node-edit' : ''}
        {$activeNodeID === node.id ? 'layout-node-active' : ''}
        layout-node"
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

    {#each node.children as child}
        <svelte:self 
            node={child} 
            {edit} 
            child={true} 
            depth={depth + 1}
            on:dragParent={startMovement}
        />
    {/each}
</div>