<script>
	import Inner from "./inner.svelte";
</script>


<div class="flex">
    <div id="outer-div" class="bg-slate-600 m-2 rounded">
        <Inner />
    </div>
</div>

<style>
    #outer-div {
        position: relative;
        top: 20px; left: 30px;
        width: 200px;
        height: 200px;
    }

    #outer-div:hover {
        outline: 5px solid gold
    }
</style>