<script lang='ts'>
	import type { LayoutNodeCls } from "$lib/classes/layoutTree"
    import { layoutTree } from "$lib/stores/layoutStore"
    import { createEventDispatcher } from "svelte"
    import { activeNode } from "$lib/stores/editor"
    const dispatch = createEventDispatcher()

    let unsaved: boolean
    $: unsaved = $activeNode?.unsaved || false

    let top: number, left: number, editing: boolean
    $: if ($activeNode && !editing) {
        top = $activeNode.top
        left = $activeNode.left
    }

    const startEditing = () => {
        editing = true
    }

    const endEditing = () => {
        editing = false
        if ($activeNode) {
            activeNode.set($activeNode.setPosition(left, top))
        }
        $layoutTree.update()
    }

    const onkey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') endEditing()
        else {
            if (!editing) startEditing()
        }
    }

</script>

{#if $activeNode}
    <div id="node-info-panel" 
        class="variant-glass-primary 
            rounded px-4 pt-1 m-4 
            flex flex-col items-start justify-start
            h-[300px]
            w-[400px]
            top-0 right-0
            absolute
            text-white">

        <span class="h3 mb-2">
            { $activeNode?.key || ''}
        </span>

        <label for="top-input" class="label flex items-center w-[100%]">
            <span class="mr-4">Top:</span>
            <input name="top-input" type='number' class="input variant-form-material"
                bind:value={top} 
                on:focus={startEditing}
                on:blur={endEditing}
                on:keyup={onkey}
            />
        </label>

        <label for="left-input" class="label flex items-center w-[100%]">
            <span class="mr-4">Left:</span>
            <input name="left-input" type='number' class="input variant-form-material"
                bind:value={left} 
                on:focus={startEditing}
                on:blur={endEditing}
                on:keyup={onkey}
            />
        </label>

        {#if unsaved}
            <div class="px-2 p-1 h4 mt-4 w-[100%] flex justify-around">
                <button on:click={() => dispatch('save_active')}
                    class="btn variant-filled-primary">
                    Save
                </button>
                
                <button on:click={() => dispatch('reset_active')} 
                    class="btn variant-filled-primary">
                    Reset
                </button>
            </div>
        {/if}
    </div>
{/if}
