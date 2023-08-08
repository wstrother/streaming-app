<script lang="ts">
    import { layoutNodes } from '$lib/classes/layoutTree.js'
    import { stateVariables, type StateVariableDB } from '$lib/classes/stateVariables.js'
    import { supabase } from '$lib/supabaseClient.js';
	import { wheel } from '$lib/stores/editor'
    export let data

    layoutNodes.setNodes(data.nodes)
    stateVariables.setVariables(data.stateVariables)

    supabase.channel('state_vars_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'state_variables'},
        payload => {
            console.log(payload.new)
            if (payload.new) {
                stateVariables.setVar(payload.new as StateVariableDB)
            }
        }).subscribe()
</script>

{#if data.edit}
    <div id='faux-bg'/>
    <div id='scale-bg' on:wheel={wheel}/>
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