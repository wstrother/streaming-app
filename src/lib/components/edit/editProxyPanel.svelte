<script lang='ts'>
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import ProxyInput from "./proxyInput.svelte"
	import type { StateVariableProxy } from "$lib/classes/stateVariables"
	import type { ProxyAttrs } from "$lib/classes/dbProxy"
    
    import { page } from '$app/stores'
    let { supabase } = $page.data
    $: ({ supabase } = $page.data)

    export let proxy: LayoutNodeProxy | StateVariableProxy
    export let attrs: ProxyAttrs = []

    
    let unsaved: boolean
    $: unsaved = proxy?.unsaved || false

    const reset = () => {
        if (!proxy) return

        proxy.resetChanges()
    }

    const save = async () => {
        if (!proxy) return

        await proxy.saveChangesToDB(supabase)
    }
    
</script>

    <div id="node-info-panel" 
        class="variant-glass-primary 
            rounded px-4 pt-1 m-4 
            flex flex-col items-start
            text-white">

        <span class="h3 mb-2 pl-16">{ proxy.key }</span>

        {#each attrs as attr}            
            <ProxyInput proxy={proxy} {attr}/>
        {/each}

        <div id="save-panel" class={!unsaved ? "opacity-[50%]" : ''}>
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

<style lang="postcss">
    #save-panel {
        @apply px-2 p-1 h4 my-2 w-[100%] flex justify-around
    }
</style>
