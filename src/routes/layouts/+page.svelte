<script lang="ts">
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    const layoutNames: string[] = data.layoutNames ?? []
</script>

<div id="layouts" class="flex flex-col variant-ghost-primary m-4 w-1/2 p-2">
    <span>Open Layout:</span>

    {#each layoutNames as name}
        <a href={`/stream/${name}`}
            class="bg-primary-500 rounded px-1 mb-2 hover:bg-primary-400">
            {name}
        </a>
    {/each}
</div>
