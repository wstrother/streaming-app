<script lang="ts">
    import { ctxMenu, activeProxyID, type CtxMenuItem, type CtxMenu } from "$lib/stores/editor"
    import { LayoutNodeProxy, layoutNodes } from "$lib/classes/layoutNodes"
    
    let activeNode: LayoutNodeProxy | null 
    $: activeNode = layoutNodes.getNodeByID($layoutNodes, $activeProxyID)

    const handleClick = (e: MouseEvent, item: CtxMenuItem) => {
        if (item.disabled) {
            e.stopPropagation()
            return
        }
        if (item.action) item.action()
    }

    let options: CtxMenu
    $: {
        options = $ctxMenu.menu ?? []
    }
</script>


<div id="context-menu" 
    class={$ctxMenu.hidden ? 'hidden' : ''}
    style={`top: ${$ctxMenu.top ?? 0}px; left: ${$ctxMenu.left ?? 0}px`}
    >
    
    {#each options as option}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="hover:bg-primary-600 p-2 cursor-pointer"
            class:disabled={option.disabled || !option.action}
            on:click={(e) => handleClick(e, option)}>
                {option.key}
        </div>
    {/each}

</div>

<style lang="postcss">
    #context-menu {
        @apply flex-col bg-primary-500 rounded-md;
        width: 200px;
        position: absolute;
        z-index: 500;
        overflow: hidden;
    }

    #context-menu div:not(:last-child) {
        border-bottom-width: 1px;
        @apply border-b-primary-600
    }

    .disabled {
        @apply hover:bg-primary-400 bg-primary-400 cursor-default text-gray-500;
    }

    .hidden {
        display: none
    }
</style>