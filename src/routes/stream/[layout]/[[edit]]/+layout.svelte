<script lang="ts">
    import { layoutNodes, type LayoutNodeUpdate } from '$lib/classes/layoutNodes.js'
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
    import { activeNodeID } from '$lib/stores/editor'
    import { supabase } from '$lib/supabaseClient.js'
	import { wheel } from '$lib/stores/editor'

    export let data

    layoutNodes.set(layoutNodes.getNodes(data.nodes))

    stateVariables.set(stateVariables.getVars(data.stateVariables))

    supabase.channel('changes').on('postgres_changes',
        {event: '*', schema: 'public'},
        payload => {
            if (payload.eventType === 'DELETE') return
            if (payload.new) {
                if (payload.table === 'layout_nodes') {
                    layoutNodes.updateData($layoutNodes, payload.new as LayoutNodeUpdate)
                }
                if (payload.table === 'state_variables') {
                    stateVariables.updateData($stateVariables, payload.new as StateVariableUpdate)
                }
            }
        }
    ).subscribe()

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