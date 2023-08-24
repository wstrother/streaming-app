<script lang="ts">
    import { ctxMenu, activeNodeID } from "$lib/stores/editor"
    import { LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
    
    let activeNode: LayoutNodeProxy | null 
    $: activeNode = layoutNodes.getNodeByID($layoutNodes, $activeNodeID)
    
    type CtxItem = {
        key: String
        disabled?: boolean
        action?: () => void
    }
    let options: CtxItem[] = []

    $: {
        options.push({key: 'Save', disabled: true})
        options.push({key: 'Reset', disabled: true})
        options.push({key: 'test', action: () => alert('hey!')})
    }

    const handleClick = (item: CtxItem) => {
        if (item.action) item.action()
    }
</script>


<div id="context-menu" 
    class={$ctxMenu.hidden ? 'hidden' : ''}
    style={`top: ${$ctxMenu.top ?? 0}px; left: ${$ctxMenu.left ?? 0}px`}
    >
    
    {#each options as item}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class={`hover:bg-primary-600 p-2 rounded-md ${item.disabled}`} 
            on:click={() => handleClick(item)}>
                {item.key}
        </div>
    {/each}

</div>

<style lang="postcss">
    #context-menu {
        @apply flex-col bg-primary-500 rounded-md;
        width: 200px;
        position: absolute;
        z-index: 500;
    }

    .disabled {
        @apply hover:bg-primary-400 bg-primary-400;
    }

    .hidden {
        display: none
    }
</style>