<script lang="ts">
    import { ctxMenu } from "$lib/stores/editor"
</script>


<div id="context-menu" 
    class={$ctxMenu.hidden ? 'hidden' : ''}
    style={`top: ${$ctxMenu.top ?? 0}px; left: ${$ctxMenu.left ?? 0}px`}
    >Hi There</div>

<style lang="postcss">
    #context-menu {
        @apply flex-col bg-primary-500 p-2;
        width: 200px;
        position: absolute;
    }

    .hidden {
        display: none
    }
</style>