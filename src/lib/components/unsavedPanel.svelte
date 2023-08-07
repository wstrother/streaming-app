<script lang='ts'>
    import { layoutTree } from "$lib/stores/layoutStore";
    // import type { LayoutNodeCls } from "$lib/classes/layoutTree"
    // export let nodes: Array<LayoutNodeCls>

</script>

<div id="unsaved-panel" class="variant-glass-primary rounded p-4">
    <h1 class="h1">UNSAVED</h1>
    {#each $layoutTree.nodes.filter(n => n.unsaved) as node}
        <p>{node.key}</p>
    {/each}
</div>

<style>
    #unsaved-panel {
        position: absolute;
        z-index: 2;
        right: 100px;
        bottom: 100px;
    }
</style>