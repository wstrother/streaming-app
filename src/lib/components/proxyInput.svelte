<script lang="ts">
	import type { DatabaseColumnName, DatabaseTableName, ProxyDBRow } from "$lib/classes/dbProxy";
    
    export let proxy: ProxyDBRow<DatabaseTableName>
    export let attr: DatabaseColumnName<DatabaseTableName>
        
    const valueType = (v: any) => isNaN(Number(String(v))) ? 'string' : 'number'
    let inputType: 'string'|'number' = valueType(proxy.getColumn(attr))
    let fieldValue: string | number | null
    let editing = false

    $: if (!editing) {
        fieldValue = proxy.getColumn(attr) as string | number | null
        fieldValue = fieldValue ?? ''
    }
    
    let elId = `${attr}-input-${proxy.id}`
    let inputCls = "input variant-form-material text-sm pl-1"

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
    <span class="mr-4 text-lg">{attr}:</span>

    {#if inputType === 'string'}
        <input id={elId} name={elId} class={inputCls} 
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