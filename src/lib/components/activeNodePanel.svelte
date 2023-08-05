<script lang='ts'>
	import type { LayoutNodeCls } from "$lib/classes/layoutTree"

    export let node: LayoutNodeCls | null
    let unsaved: boolean
    $: unsaved = node?.unsaved || false
</script>

{#if node}
    <div id="node-info-panel" 
        class="variant-filled-primary 
            rounded px-4 pt-1 m-4 
            flex flex-col items-start justify-start
            max-h-[300px]
            min-w-[400px]
            text-white">

        <span class="h3 mb-2">
            { node?.key || ''}
        </span>

        <span>top: {node.top}</span>
        <span>left: {node.left}</span>

        {#if unsaved}
            <div class="variant-filled-warning rounded px-2 p-1 h4 mt-4">Unsaved Changes!</div>
        {/if}
    </div>
{/if}
