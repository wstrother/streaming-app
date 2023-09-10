<script lang='ts'>
	import '../app.postcss'
	import '../custom.postcss'

	import { Modal, Toast } from '@skeletonlabs/skeleton'
	import type { ModalComponent } from '@skeletonlabs/skeleton'
	import { initializeStores } from '@skeletonlabs/skeleton'
	initializeStores()

	import FullNodeList from '$lib/components/modals/fullNodeList.svelte'
	import OrderNodesPanel from '$lib/components/modals/orderNodesPanel.svelte'
	import FullVarsList from '$lib/components/modals/fullVarsList.svelte'
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { stateVariables } from '$lib/classes/stateVariables';
	import { activeProxyID } from '$lib/stores/editor';
		
	export let data
	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const {data: { subscription },} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}

			if (event === 'SIGNED_OUT') {
				invalidate('supabase:auth')
				stateVariables.resetStore()
			}
		})

		return () => subscription.unsubscribe()
	})

	const components: Record<string, ModalComponent> = {
		fullNodeList: {ref: FullNodeList},
		orderChildNodes: {ref: OrderNodesPanel},
		fullVarsList: {ref: FullVarsList}
	}

	const unselect = ({target}: MouseEvent) => {
		if (target && (target as HTMLElement).tagName === 'BODY') {
			activeProxyID.set(null)
		}
	}
</script>

<svelte:body on:mousedown|capture={unselect}/>

{#if !data.inOBS}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class='faux-bg bg-gray-700 z-[-100]' />

	<ol id="main-nav" class="breadcrumb bg-primary-600 z-50 justify-end pr-8">
		{#if session?.user }
			<button class="btn btn-sm" on:click={() => supabase.auth.signOut()}>Log Out</button>
			{#if session.user.email}
			<button class="btn btn-sm" on:click={() => supabase.auth.resetPasswordForEmail(session.user.email ?? '', {
				redirectTo: 'http://127.0.0.1:5173/auth/callback?next=/account/update-password',
			  })}>Reset Password
			</button>
			{/if}

			<li><a href="/">Home</a></li>
			<li class="crumb-separator" aria-hidden>|</li>
			
			<li><a href="/layouts">Layouts</a></li>
			<li class="crumb-separator" aria-hidden>|</li>
			
			<li><a href="/images">Images</a>
			<li class="crumb-separator" aria-hidden>|</li>
			
			<li><a href="/vars">Variables</a></li>
		{/if}
	</ol>

{/if}

<slot />

<Modal {components} transitions={false}
	background="bg-primary-500" 
	regionBackdrop="variant-soft-secondary"
	regionBody="text-white" 
	regionHeader="text-white text-2xl font-bold"/>

<Toast />