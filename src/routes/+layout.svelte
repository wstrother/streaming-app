<script lang='ts'>
	import '../app.postcss'
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

<Modal {components} transitions={false}
	background="bg-primary-600" 
	regionBackdrop="variant-soft-secondary"
	regionBody="text-white" 
	regionHeader="text-white text-2xl font-bold"/>

<Toast />

<slot />

{#if !data.inOBS}
	<div class='faux-bg bg-gray-700'/>
{/if}

<style>
	.faux-bg {z-index: -100;}
</style>