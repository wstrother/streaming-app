<script lang='ts'>
	import { goto } from '$app/navigation';

  export let data
  let { supabase, session } = data
  $: ({ supabase, session } = data)
  
  const handleSignIn = async () => {
    loading = true
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    goto('/layouts')
  }

  let email: string, password: string
  let loading: boolean = false
</script>

<h1 class="h1 z-[10]">
  {session?.user ? `Welcome, ${session.user.email}` : 'Please Sign In'}
</h1>

{#if !session?.user}
  <div class="p-4 w-[600px]">
    <form on:submit={handleSignIn}  
      class="variant-ghost-primary flex flex-col gap-y-4 p-4 m-2">

      <div class="flex items-center">
        <label for="email">Email:</label>
        <input name="email" type="text" bind:value={email} />
      </div>

      <div class="flex items-center">
        <label for="password">Password:</label>
        <input name="password" type="password" bind:value={password} />
      </div>

      <input type="submit" class="btn btn-sm variant-filled-primary"
        disabled={loading} value="Sign In" />
    </form>
  </div>
{/if}

<style lang="postcss">
  label {
    @apply w-[120px] text-white font-bold flex justify-end pr-2
  }
</style>
