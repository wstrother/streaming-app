<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables"
    import ProxyInput from "$lib/components/proxyInput.svelte"
</script>

<div id="vars-container">
    {#each $stateVariables as sv}

        <div class="variant-glass-primary text-white rounded m-4 p-4">
            <span class="h3">{sv.key}</span>
            
            <!-- <ProxyEditor proxy={sv} /> -->
            <ProxyInput proxy={sv} attr='key' inputType='string' proxyValue={sv.key}/>
            <ProxyInput proxy={sv} attr='value' inputType={isNaN(Number(String(sv.value)))?'string':'number'} proxyValue={sv.value}/>

            {sv.unsaved}
        </div>
        
    {/each}
</div>

<style lang='postcss'>

    #vars-container {
        @apply m-4;
        width: 500px;
    }
</style>