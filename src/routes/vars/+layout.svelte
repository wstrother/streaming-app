<script lang="ts">
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
	import { activeVarId } from '$lib/stores/editor.js';
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
</script>

<div id='faux-bg' />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id='scale-bg' on:mousedown={() => activeVarId.set(null)}/>
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