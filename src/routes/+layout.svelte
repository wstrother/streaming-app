<script lang='ts'>
	import '../app.postcss'
	import '../custom.postcss'
	import { Modal, Toast } from '@skeletonlabs/skeleton'
	import type { ModalComponent } from '@skeletonlabs/skeleton'
	import { initializeStores } from '@skeletonlabs/skeleton'
	initializeStores()

	export let data: PageData

	import FullNodeList from '$lib/components/modals/fullNodeList.svelte'
	import OrderNodesPanel from '$lib/components/modals/orderNodesPanel.svelte'
	import FullVarsList from '$lib/components/modals/fullVarsList.svelte'
	import type { PageData } from './$types';

	const components: Record<string, ModalComponent> = {
		fullNodeList: {ref: FullNodeList},
		orderChildNodes: {ref: OrderNodesPanel},
		fullVarsList: {ref: FullVarsList}
	}

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

<Modal {components} transitions={false}
	background="bg-primary-600" 
	regionBackdrop="variant-soft-secondary"
	regionBody="text-white" 
	regionHeader="text-white text-2xl font-bold"/>

<Toast />