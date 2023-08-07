<script>
	import { wheel } from '$lib/stores/editor'
    export let data;
</script>

{#if data.edit}
    <div id='faux-bg'/>
    <div id='scale-bg' on:wheel={wheel}/>
{/if}

<slot />

<style>
    #faux-bg {
        background-color: #333;
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: -100;
    }

    #scale-bg {
        position: absolute;
        width: 100vw;
        height: 100vw;
    }
</style>