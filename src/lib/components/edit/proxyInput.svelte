<script lang="ts">
	import type { DatabaseColumnName, DatabaseTableName, ProxyAttr, ProxyDBRow, StateVarTypesLiterals } from "$lib/classes/dbProxy"
    
    export let proxy: ProxyDBRow<DatabaseTableName>
    export let attr: ProxyAttr
    export let nullable: boolean = true

    let attrName: DatabaseColumnName<DatabaseTableName>
    let inputType: StateVarTypesLiterals = 'string'
    let fieldValue: string | number | boolean | null

    if (typeof(attr) === 'object') {
        attrName = attr[0]
        inputType = attr[1] as StateVarTypesLiterals
    } else {
        attrName = attr
    }
        
    let editing = false

    $: if (!editing) {
        fieldValue = proxy.getColumn(attrName) as string | number | null
        fieldValue = fieldValue ?? ''
    }
    
    let elId = `${attrName}-input-${proxy.id}`

    const startEditing = () => {
        editing = true
    }

    const endEditing = () => {
        editing = false

        let proxyValue = fieldValue

        if (inputType === 'number' && fieldValue === '') proxyValue = nullable ? null : 0
        if (inputType === 'boolean') {
            if (fieldValue === '' && nullable) proxyValue = null
            else proxyValue = Boolean(fieldValue)
        }

        proxy.setColumn(attrName, proxyValue)   // TODO: ensure string "" not passed to numbers
    }

    const onkey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') endEditing()
        else {
            if (!editing) startEditing()
        }
    }
</script>

<label for={elId} class="label flex items-center w-[100%]">
    <span class="mr-4 h-5 w-20 flex justify-end">{attrName}:</span>

    {#if inputType === 'string'}
        <input id={elId} name={elId}
            on:focus={startEditing}
            on:blur={endEditing}
            on:keyup={onkey}
            bind:value={fieldValue} />
    {/if}

    {#if inputType === 'number'}
        <input id={elId} name={elId} type='number'
            placeholder={nullable ? "null" : "0"}
            on:focus={startEditing}
            on:blur={endEditing}
            on:keyup={onkey}
            bind:value={fieldValue} />
    {/if}
</label>

<!-- svelte-ignore css-unused-selector -->
<style lang="postcss">
    input {
        @apply input variant-form-material text-sm pl-1
    }
</style>