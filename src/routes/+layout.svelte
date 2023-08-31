<script lang='ts'>
	import '../app.postcss'
	import { Modal } from '@skeletonlabs/skeleton'
	import type { ModalComponent } from '@skeletonlabs/skeleton'
	import { initializeStores } from '@skeletonlabs/skeleton'
	import { fade } from 'svelte/transition'
	initializeStores()

	import FullNodeList from '$lib/components/fullNodeList.svelte'

	const components: Record<string, ModalComponent> = {
		fullNodeList: {ref: FullNodeList},
	}

</script>

<Modal {components} transitionIn={fade} transitionOut={fade}
	background="bg-primary-600" 
	regionBackdrop="variant-soft-secondary"
	regionBody="text-white" 
	regionHeader="text-white text-2xl font-bold"/>

<slot />
