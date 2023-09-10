<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
    import type { PageData } from './$types'
    
    export let data: PageData
    let { supabase } = data
    $: supabase = data.supabase

    let password: string
    let confirm: string

    const handlePW = async () => {
        if (password === confirm) {
            await supabase.auth.updateUser({ password })
        }
    }

    let errorMsg: string | null
    $: errorMsg = password === confirm ? null : 'confirmation pw does not match'
</script>

<div class="p-2 gap-2 flex flex-col w-[400px] ml-8">
    <input type='password' name='password' bind:value={password}>
    <input type='password' name='confirm' bind:value={confirm}>
    <button class="btn btn-sm variant-filled-primary" on:click={handlePW} 
    disabled={Boolean(errorMsg) || (password?.length ?? 0) < 11 }>
        Change Password
    </button>
</div>

{#if errorMsg}
<div class="variant-filled-warning rounded w-[400px] p-2 ml-8">{errorMsg}</div>
{/if}

