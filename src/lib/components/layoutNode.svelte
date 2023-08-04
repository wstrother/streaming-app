<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { LayoutNodeCls } from '$lib/classes/layoutTree'
    import type { StateVariableValue } from '$lib/classes/variableMap'
    import { stateVariableStore } from '$lib/stores/varStore'
    
    export let node: LayoutNodeCls
    export let edit: boolean
    const dispatch = createEventDispatcher()

    let posCSS: string, wCSS: string, hCSS: string, inlineCSS: string
    $: posCSS = `top: ${node.top}px; left: ${node.left}px;`
    $: wCSS = node.width ? `width: ${node.width}px;` : ''
    $: hCSS = node.height ? `height: ${node.height}px;` : ''
    $: inlineCSS = `${posCSS}${wCSS}${hCSS}`

    let varValue: StateVariableValue = ''
    $: if (node.variable_id) {
            varValue = $stateVariableStore.getVarByID(node.variable_id)
        }
    // bg-primary-500
    // text-xl
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    on:mouseover={(e) => dispatch(e.type, {node})}
    on:mouseleave={(e) => dispatch(e.type, {node})}
    id="layoutNode-{node.key}"
    style={inlineCSS}
    class="{node.classes}
        min-w-content
        min-h-content
        absolute
        select-none
        cursor-pointer
        {edit ? 'layout-node-edit' : ''}
        layout-node"
>
    <span class="layout-node-content">
        {node.content ?? ''}
    </span>

    <span class="layout-node-var">
        {varValue}
    </span>
</div>