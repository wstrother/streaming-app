<script lang="ts">
    import type { LayoutNodeCls } from '$lib/classes/layoutTree'
    import type { StateVariableValue } from '$lib/classes/variableMap'
    import { stateVariableStore } from '$lib/stores/varStore'
    import { activeNode } from '$lib/stores/editor'
    
    export let node: LayoutNodeCls
    export let edit: boolean

    let posCSS: string, wCSS: string, hCSS: string, inlineCSS: string
    $: posCSS = `top: ${node.top}px; left: ${node.left}px;`
    $: wCSS = node.width ? `width: ${node.width}px;` : ''
    $: hCSS = node.height ? `height: ${node.height}px;` : ''
    $: inlineCSS = `${posCSS}${wCSS}${hCSS}`

    let varValue: StateVariableValue = ''
    $: if (node.variable_id) {
            varValue = $stateVariableStore.getVarByID(node.variable_id)
        }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
    on:mousedown={e => {activeNode.set(node)}}
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