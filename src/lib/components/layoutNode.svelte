<script lang="ts">
    import type { Database } from '$lib/types/supabase';

    export let node: Database['public']['Tables']['layout_nodes']['Row'];

    let positionalCSS: string
    $: positionalCSS = `
        top: ${node.top}px;
        left: ${node.left}px;
        width: ${node.width}px;
        height: ${node.height}px;
    `
</script>

<div 
    id="layoutNode-{node.key}"
    style={positionalCSS}
    class="
        bg-primary-500
        absolute
        layout-node"
>
    {node.content ?? ''}
</div>
