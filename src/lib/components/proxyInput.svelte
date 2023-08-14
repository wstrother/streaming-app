<script lang="ts">
	import type { DatabaseColumnName, DatabaseTableName, ProxyDBRow } from "$lib/classes/dbProxy";
    
    export let proxy: ProxyDBRow<DatabaseTableName>
    export let attr: DatabaseColumnName<DatabaseTableName>

    export let inputType: 'string'|'number' = 'string'

    let fieldValue: string|number
    let editing = false

    $: if (!editing) {
        fieldValue = proxy.getColumn(attr) ?? ''
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