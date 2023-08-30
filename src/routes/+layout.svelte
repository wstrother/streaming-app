<script lang='ts'>
	import '../app.postcss';
	import { Modal } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import NewNodePanel from '$lib/components/newNodePanel.svelte';
	initializeStores()

	const modalComponentRegistry: Record<string, ModalComponent> = {
	NewNodePanel: {ref: NewNodePanel}
	};

</script>

<Modal components={modalComponentRegistry}/>

<slot />
