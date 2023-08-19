<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables"
	import EditProxyPanel from "$lib/components/editProxyPanel.svelte";
    // import ProxyInput from "$lib/components/proxyInput.svelte"

</script>

<div id="vars-container">
    {#each $stateVariables as sv}

        <EditProxyPanel proxy={sv}
            attrs={['key', 'value']}
        />

        <!-- <div class="variant-glass-primary text-white rounded m-4 p-4">
            <span class="h3">{sv.key}</span>
            
            <ProxyInput proxy={sv} attr='key' />

            <ProxyInput proxy={sv} attr='value' />

            {sv.unsaved}
        </div> -->
        
    {/each}
</div>

<style lang='postcss'>

    #vars-container {
        @apply m-4;
        width: 500px;
    }
</style>