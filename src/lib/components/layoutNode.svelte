<script lang="ts">
    import type { LayoutNode } from '$lib/stores/layouts'
    import type { StateVariable } from '$lib/stores/vars'
    import { stateVariables } from '$lib/stores/vars'

    export let node: LayoutNode

    let posCSS: string, wCSS: string, hCSS: string, inlineCSS: string
    $: posCSS = `top: ${node.top}px; left: ${node.left}px;`
    $: wCSS = node.width ? `width: ${node.width}px;` : ''
    $: hCSS = node.height ? `height: ${node.height}px;` : ''
    $: inlineCSS = `${posCSS}${wCSS}${hCSS}`

    const getSV = (vars: Array<StateVariable>) => {
        let value = ''
        vars.forEach(sv => {
            if (sv.id === node.variable_id) value = sv.value ?? ''
        })
        return value
    }
</script>

<div 
    id="layoutNode-{node.key}"
    style={inlineCSS}
    class="{node.classes}
        min-w-content
        min-h-content
        absolute
        select-none
        cursor-pointer
        layout-node"
>
    <span class="layout-node-content">
        {node.content ?? ''}
    </span>

    <span class="layout-node-var">
        {getSV($stateVariables)}
    </span>
</div>
