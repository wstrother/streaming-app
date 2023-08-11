<script lang="ts">
    import type { LayoutNodeProxy } from '$lib/classes/layoutNodes'
    import { stateVariables } from '$lib/classes/stateVariables'
    import { activeNode, scalePercent } from '$lib/stores/editor'
    
    export let node: LayoutNodeProxy
    export let edit: boolean
    const varValue = stateVariables.getVarStore(node.variable_id)

    let posCSS: string, wCSS: string, hCSS: string, inlineCSS: string
    $: posCSS = `top: ${node.top}px; left: ${node.left}px;`
    $: wCSS = node.width ? `width: ${node.width}px;` : ''
    $: hCSS = node.height ? `height: ${node.height}px;` : ''
    $: inlineCSS = `${posCSS}${wCSS}${hCSS}`
    
    let moving: boolean = false
    let moveFactor: number = 1
    $: moveFactor = 1 / ($scalePercent / 100)

    function start() {
        if (edit) {
            moving = true;
            activeNode.set(node)
        }
	}
	
	function stop() {
		moving = false;
	}
	
	function move(e: MouseEvent) {
        if (moving) {
            node = node.move(e.movementX * moveFactor, e.movementY * moveFactor)
            activeNode.set(node)
        }
	}	

</script>

<svelte:window on:mouseup={stop} on:mousemove={move}  />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
    on:mousedown|preventDefault={start} 
    id="layoutNode-{node.key}"
    style={inlineCSS}
    class="{node.classes}
        min-w-content
        min-h-content
        absolute
        select-none
        cursor-pointer
        {edit ? 'layout-node-edit' : ''}
        {$activeNode?.id === node.id ? 'layout-node-active' : ''}
        layout-node"
>
    <span class="layout-node-content">
        {node.content ?? ''}
    </span>

    {#if node.variable_id}
    <span class="layout-node-var">
        {$varValue}
    </span>
    {/if}
</div>