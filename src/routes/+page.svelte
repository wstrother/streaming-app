<script lang='ts'>
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)
    
    const handleSignIn = async () => {
      await supabase.auth.signInWithPassword({
        email: "wyatt.strother@gmail.com",
        password: "mooshu11",
      })
    }
  
    const handleSignOut = async () => {
      await supabase.auth.signOut()
    }

    const getLayouts = async () => {
        const { data, error } = await supabase.from('layouts')
            .select('name')
        
        console.log(data)
    }

    let email: string, password: string
  </script>


<button on:click={handleSignIn} class="btn btn-sm variant-filled-primary">Sign in</button>
<button on:click={handleSignOut} class="btn btn-sm variant-filled-primary">Sign out</button>
<button on:click={getLayouts} class="btn btn-sm variant-filled-primary">Get Layouts</button>

{#if session}
  <pre>{session.user.email}</pre>
{/if}