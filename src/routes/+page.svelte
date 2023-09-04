<script lang='ts'>
	import { goto } from '$app/navigation';

    export let data
    let { supabase } = data
    $: ({ supabase } = data)
    
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

<div class="p-4 w-[600px]">
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
</div>

<style lang="postcss">
  label {
    @apply w-[120px] text-white font-bold flex justify-end pr-2
  }
</style>
