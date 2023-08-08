<script lang="ts">
    import { layoutNodes } from '$lib/classes/layoutTree.js'
	import { wheel } from '$lib/stores/editor'
    export let data

    layoutNodes.setNodes(data.nodes)
</script>

{#if data.edit}
    <div id='faux-bg'/>
    <div id='scale-bg' on:wheel={wheel}/>
{/if}

<slot />

<style>
    #faux-bg {
        background-color: #333;
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: -100;
    }

    #scale-bg {
        position: absolute;
        width: 100vw;
        height: 100vw;
    }
</style>