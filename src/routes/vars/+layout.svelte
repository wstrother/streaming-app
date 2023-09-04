<!-- <script lang="ts">
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
	import { activeProxyID } from '$lib/stores/editor.js';
    import { supabase } from '$lib/supabaseClient.js'

    export let data

    stateVariables.set(stateVariables.getVars(data.stateVariables))

    supabase.channel('state_vars_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'state_variables'},
        payload => {
            if (payload.new) {
                stateVariables.updateData($stateVariables, payload.new as StateVariableUpdate)
            }
        }).subscribe()
</script> -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- <div class='faux-bg' on:mousedown={() => activeProxyID.set(null)}/>
<slot /> -->
<slot />
