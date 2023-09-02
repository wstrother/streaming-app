<script lang="ts">
	import type { ProxyAttrs } from "$lib/classes/dbProxy";
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes"
	import EditProxyPanel from "./editProxyPanel.svelte"
    import { getModalStore } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()

    export let node: LayoutNodeProxy

    let attrs: ProxyAttrs = [
        'content',
        ['top', 'number'],
        ['left', 'number'],
        'classes',
        ['width', 'number'],
        ['height', 'number'],
    ]

    const setParent = () => {
        modalStore.trigger({
            type: 'component',
            component: 'fullNodeList',
            meta: {
                onClick: (e: CustomEvent) => {
                    node.setColumn("parent_node_id", e.detail.id)
                    modalStore.close()
                },
                exclude: [node.id, node.parent_node_id]
            }
        })
    }
</script>

<EditProxyPanel proxy={node} {attrs}/>

<div class="variant-glass-primary m-4 rounded p-3 text-white flex flex-col">
    <button on:click={setParent}>Set Parent ID</button>
    <button>Set Variable ID</button>
    <button>Set Conditional Boolean ID</button>
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang='postcss'>
    button {
        @apply mb-1 btn variant-filled-primary
    }
</style>