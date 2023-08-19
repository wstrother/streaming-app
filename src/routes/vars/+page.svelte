<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables"
	import EditProxyPanel from "$lib/components/editProxyPanel.svelte";

</script>

<div id="vars-container">
    {#each $stateVariables as sv}
        <EditProxyPanel proxy={sv} attrs={['key', 'value']} />
        
    {/each}
</div>

<style lang='postcss'>

    #vars-container {
        @apply m-4;
        width: 500px;
    }
</style>