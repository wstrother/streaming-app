<script lang='ts'>
	import '../app.postcss'
	import { Modal } from '@skeletonlabs/skeleton'
	import type { ModalComponent } from '@skeletonlabs/skeleton'
	import { initializeStores } from '@skeletonlabs/skeleton'
	initializeStores()

	import FullNodeList from '$lib/components/modals/fullNodeList.svelte'
	import OrderNodesPanel from '$lib/components/modals/orderNodesPanel.svelte'
	import FullVarsList from '$lib/components/modals/fullVarsList.svelte'

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

<slot />
