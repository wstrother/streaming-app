<script lang="ts">
    import { layoutNodes, type LayoutNodeUpdate } from '$lib/classes/layoutNodes.js'
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
    import { activeNodeID } from '$lib/stores/editor'
    import { supabase } from '$lib/supabaseClient.js'
	import { wheel } from '$lib/stores/editor'

    export let data

    layoutNodes.set(layoutNodes.getNodes(data.nodes))

    stateVariables.set(stateVariables.getVars(data.stateVariables))

    supabase.channel('state_vars_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'state_variables'},
        payload => {
            if (payload.new) {
                stateVariables.updateVar($stateVariables, payload.new as StateVariableUpdate)
            }
        }).subscribe()
    
    supabase.channel('layout_nodes_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'layout_nodes'},
        payload => {
            if (payload.new) {
                layoutNodes.updateNode($layoutNodes, payload.new as LayoutNodeUpdate)
            }
        }).subscribe()

</script>


{#if data.edit}
    {#if !data.inOBS}
        <div id='faux-bg'/>
    {/if}

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id='scale-bg'
        on:contextmenu|preventDefault
        on:wheel|preventDefault={wheel} 
        on:mousedown={() => activeNodeID.set(null)}/>
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