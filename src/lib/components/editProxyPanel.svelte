<script lang='ts'>
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes";
	import ProxyInput from "./proxyInput.svelte";
	import type { StateVariableProxy } from "$lib/classes/stateVariables";
	import type { DatabaseColumnName, DatabaseTableName } from "$lib/classes/dbProxy";

    export let proxy: LayoutNodeProxy | StateVariableProxy | null
    export let attrs: DatabaseColumnName<DatabaseTableName>[] = []
    
    let unsaved: boolean
    $: unsaved = proxy?.unsaved || false

    const reset = () => {
        if (!proxy) return

        proxy.resetChanges()
    }

    const save = async () => {
        if (!proxy) return

        await proxy.saveChangesToDB()
    }
    
</script>

{#if proxy}
    <div id="node-info-panel" 
        class="variant-glass-primary 
            rounded px-4 pt-1 m-4 
            flex flex-col items-start justify-start            
            text-white">

        <span class="h3 mb-2">
            { proxy.key }

            {#each attrs as attr}            
                <ProxyInput proxy={proxy} {attr}/>
            {/each}
        </span>

        <div class="px-2 p-1 h4 my-2 w-[100%] flex justify-around">
            <button on:click={save} disabled={!unsaved}
                class="btn variant-filled-primary">
                Save
            </button>
            
            <button on:click={reset} disabled={!unsaved}
                class="btn variant-filled-primary">
                Reset
            </button>
        </div>
    </div>
{/if}
