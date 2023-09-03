<script lang="ts">
    import { layoutNodes, type LayoutNodeUpdate } from '$lib/classes/layoutNodes.js'
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
    import { activeProxyID } from '$lib/stores/editor'
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
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="faux-bg"
        on:contextmenu|preventDefault
        on:wheel|preventDefault={wheel} 
        on:mousedown={() => activeProxyID.set(null)}/>
{/if}

<slot />