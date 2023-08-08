<script lang="ts">
    export let data

    const layoutNames = data.layoutNames
</script>

{#each layoutNames as name}
    <a href={`/stream/${name}`}>Open layout: {name}</a>
{/each}