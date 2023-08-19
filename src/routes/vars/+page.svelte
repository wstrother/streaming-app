<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables"
	import EditProxyPanel from "$lib/components/editProxyPanel.svelte";
	import UnsavedPanel from "$lib/components/unsavedPanel.svelte";

</script>

<div id="vars-container">
    {#each $stateVariables as sv}
        <EditProxyPanel proxy={sv} attrs={['key', 'value']} />
    {/each}

    <UnsavedPanel header="Unsaved State Variables:" 
        proxies={$stateVariables.filter(sv => sv.unsaved)} />
</div>

<style lang='postcss'>

    #vars-container {
        @apply m-4;
        width: 500px;
    }
</style>