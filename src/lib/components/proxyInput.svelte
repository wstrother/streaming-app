<script lang="ts">
	import type { LayoutNodeProxy } from "$lib/classes/layoutNodes";
	import type { StateVariableProxy } from "$lib/classes/stateVariables";
    
    export let attr: string
    export let proxy: StateVariableProxy | LayoutNodeProxy
    export let proxyValue: string|number|null
    export let inputType: 'string'|'number'

    let fieldValue: string|number
    let editing = false
    $: if (!editing) {
        fieldValue = proxyValue ?? ''
    }
    
    let elId = `${attr}-input-${proxy.id}`
    let inputCls = "input variant-form-material"

    const startEditing = () => {
        editing = true
    }

    const endEditing = () => {
        editing = false
        proxy.setColumn(attr, fieldValue)
    }

    const onkey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') endEditing()
        else {
            if (!editing) startEditing()
        }
    }
</script>

<label for={elId} class="label flex items-center w-[100%]">
    <span class="mr-4">{attr}:</span>
    {#if inputType === 'string'}
        <input name={elId} class={inputCls} 
            on:focus={startEditing}
            on:blur={endEditing}
            on:keyup={onkey}
            bind:value={fieldValue} />
    {:else if inputType === 'number'}
        <input name={elId} class={inputCls} type='number' 
            on:focus={startEditing}
            on:blur={endEditing}
            on:keyup={onkey}
            bind:value={fieldValue} />
    {/if}
</label>