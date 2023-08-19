<script lang='ts'>
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes";
    import { createEventDispatcher } from "svelte"
	import ProxyInput from "./proxyInput.svelte";
	import type { StateVariableProxy } from "$lib/classes/stateVariables";

    const dispatch = createEventDispatcher()
    export let proxy: LayoutNodeProxy | StateVariableProxy | null
    export let attrs: string[] = []
    
    let unsaved: boolean
    $: unsaved = proxy?.unsaved || false
    
</script>

{#if proxy}
    <div id="node-info-panel" 
        class="variant-glass-primary 
            rounded px-4 pt-1 m-4 
            flex flex-col items-start justify-start
            h-[300px]
            w-[400px]
            top-0 right-0
            absolute
            text-white">

        <span class="h3 mb-2">
            { proxy.key }

            {#each attrs as attr}            
                <ProxyInput proxy={proxy} {attr}/>
            {/each}
        </span>

        {#if unsaved}
            <div class="px-2 p-1 h4 mt-4 w-[100%] flex justify-around">
                <button on:click={() => dispatch('save_changes')}
                    class="btn variant-filled-primary">
                    Save
                </button>
                
                <button on:click={() => dispatch('reset_changes')} 
                    class="btn variant-filled-primary">
                    Reset
                </button>
            </div>
        {/if}
    </div>
{/if}
