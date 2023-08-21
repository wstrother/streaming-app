<script lang="ts">
	import type { DatabaseColumnName, DatabaseTableName, ProxyAttr, ProxyDBRow, stateVarTypes } from "$lib/classes/dbProxy"
    
    export let proxy: ProxyDBRow<DatabaseTableName>
    export let attr: ProxyAttr

    let attrName: DatabaseColumnName<DatabaseTableName>
    let inputType: stateVarTypes = 'string'
    let fieldValue: string | number | null

    if (typeof(attr) === 'object') {
        attrName = attr[0]
        inputType = attr[1] as stateVarTypes
    } else {
        attrName = attr
    }
        
    let editing = false

    $: if (!editing) {
        fieldValue = proxy.getColumn(attrName) as string | number | null
        fieldValue = fieldValue ?? ''
    }
    
    let elId = `${attrName}-input-${proxy.id}`
    let inputCls = "input variant-form-material text-sm pl-1"

    const startEditing = () => {
        editing = true
    }

    const endEditing = () => {
        editing = false
        proxy.setColumn(attrName, fieldValue)
    }

    const onkey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') endEditing()
        else {
            if (!editing) startEditing()
        }
    }
</script>

<label for={elId} class="label flex items-center w-[100%]">
    <span class="mr-4 text-lg">{attrName}:</span>

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