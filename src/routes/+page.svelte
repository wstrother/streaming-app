<script lang='ts'>
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)
    
    const handleSignIn = async () => {
      loading = true
      await supabase.auth.signInWithPassword({
        email,
        password,
      })
      email = ""
      password = ""
      loading = false
    }
  
    const handleSignOut = async () => {
      loading = true
      await supabase.auth.signOut()
      loading = false
    }

    let email: string, password: string
    let loading: boolean = false
  </script>

<div class="p-4 w-[600px]">
  
  {#if session}
    <div class="variant-glass-primary flex flex-col gap-2 p-4">
  
      <button class="btn btn-sm variant-filled-primary"
        on:click={handleSignOut} disabled={loading}>
        Sign out
      </button>
  
    </div>
  {:else}
    <form class="variant-ghost-primary flex flex-col gap-y-4 p-4 m-2">
  
      <div class="flex items-center">
        <label for="email">Email:</label>
        <input name="email" type="text" bind:value={email} />
      </div>
  
      <div class="flex items-center">
        <label for="password">Password:</label>
        <input name="password" type="password" bind:value={password} />
      </div>
  
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <input type="submit" class="btn btn-sm variant-filled-primary"
        on:click={handleSignIn} disabled={loading}
        value="Sign In" />
    </form>
  {/if}
</div>

<style lang="postcss">
  label {
    @apply w-[120px] text-white font-bold flex justify-end pr-2
  }
</style>
