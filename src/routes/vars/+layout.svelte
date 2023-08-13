<script lang="ts">
    import { stateVariables, type StateVariableUpdate } from '$lib/classes/stateVariables.js'
    import { supabase } from '$lib/supabaseClient.js'
    export let data

    stateVariables.set(stateVariables.getVars(data.stateVariables))

    supabase.channel('state_vars_realtime').on('postgres_changes', 
        {event: '*', schema: 'public', table: 'state_variables'},
        payload => {
            if (payload.new) {
                stateVariables.updateVar($stateVariables, payload.new as StateVariableUpdate)
            }
        }).subscribe()
    

</script>

<div id='faux-bg'/>

<slot />

<style>
    #faux-bg {
        background-color: #333;
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: -100;
    }
</style>