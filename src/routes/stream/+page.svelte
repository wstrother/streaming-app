<script>
    import { layoutNodes } from "$lib/stores/layouts";
    
</script>

{#each $layoutNodes as node}
    <b>{node.key}</b> {node.content}
{/each}