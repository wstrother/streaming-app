<script lang="ts">
    import { stateVariables } from "$lib/classes/stateVariables";

</script>

<div id="vars-container">
    {#each $stateVariables as sv}

        <div class="bg-primary-500 rounded m-4 p-4">
            {sv.key}: {sv.value}
        </div>
        
    {/each}
</div>

<style lang='postcss'>

    #vars-container {
        @apply m-4;
        width: 500px;
    }
</style>