<script lang="ts">
    import { layoutNodes, getNodes, updateNode, type LayoutNodeUpdate } from '$lib/classes/layoutNodes.js'
    import { stateVariables, getVars, updateVar, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
    import { activeNode } from '$lib/stores/editor'
    import { supabase } from '$lib/supabaseClient.js'
	import { wheel } from '$lib/stores/editor'
    export let data

    layoutNodes.set(getNodes(data.nodes))

    stateVariables.set(getVars(data.stateVariables))

    supabase.channel('state_vars_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'state_variables'},
        payload => {
            if (payload.new) {
                updateVar($stateVariables, payload.new as StateVariableUpdate)
            }
        }).subscribe()
    
        supabase.channel('layout_nodes_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'layout_nodes'},
        payload => {
            if (payload.new) {
                updateNode($layoutNodes, payload.new as LayoutNodeUpdate)
            }
        }).subscribe()
</script>

{#if data.edit}
    <div id='faux-bg'/>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id='scale-bg' on:wheel={wheel} on:mousedown={() => activeNode.set(null)}/>
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