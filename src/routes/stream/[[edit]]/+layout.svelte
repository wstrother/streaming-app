<script>
	// import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
    // import '@skeletonlabs/skeleton/styles/skeleton.css';
	// import '../app.postcss';
    export let data;
</script>

{#if data.edit}
    <div id='faux-bg' />
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
</style>