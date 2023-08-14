<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables"
    import ProxyInput from "$lib/components/proxyInput.svelte"

    const valueType = (v: string|number|null) => isNaN(Number(String(v))) ? 'string' : 'number'
</script>

<div id="vars-container">
    {#each $stateVariables as sv}

        <div class="variant-glass-primary text-white rounded m-4 p-4">
            <span class="h3">{sv.key}</span>
            
            <!-- Type '"key"' is not assignable to type '"created_at" | "id" | "user_id"'.ts(2322) -->
            <ProxyInput proxy={sv} attr='key' />

            <ProxyInput proxy={sv} attr='value' inputType={valueType(sv.value)} />

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