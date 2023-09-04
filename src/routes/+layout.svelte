<script lang='ts'>
	import '../app.postcss'
	import '../custom.postcss'

	import { Modal, Toast } from '@skeletonlabs/skeleton'
	import type { ModalComponent } from '@skeletonlabs/skeleton'
	import { initializeStores } from '@skeletonlabs/skeleton'
	initializeStores()

	// import FullNodeList from '$lib/components/modals/fullNodeList.svelte'
	// import OrderNodesPanel from '$lib/components/modals/orderNodesPanel.svelte'
	// import FullVarsList from '$lib/components/modals/fullVarsList.svelte'
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
		
	export let data: PageData
	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const {data: { subscription },} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})

	// const components: Record<string, ModalComponent> = {
	// 	fullNodeList: {ref: FullNodeList},
	// 	orderChildNodes: {ref: OrderNodesPanel},
	// 	fullVarsList: {ref: FullVarsList}
	// }

</script>

{#if !data.inOBS}
<ol id="main-nav" class="breadcrumb bg-primary-600 z-50 justify-end pr-8">
	<li><a href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>/</li>

	<li><a href="/layouts">Layouts</a></li>
	<li class="crumb-separator" aria-hidden>/</li>
	
	<li><a href="/images">Images</a>
	<li class="crumb-separator" aria-hidden>/</li>
	
	<li><a href="/vars">Variables</a></li>
</ol>

	<div class='faux-bg bg-gray-700 z-[-100]'/>
{/if}

<slot />

<!-- <Modal {components} transitions={false}
	background="bg-primary-600" 
	regionBackdrop="variant-soft-secondary"
	regionBody="text-white" 
	regionHeader="text-white text-2xl font-bold"/> -->

<Toast />