<script lang="ts">
    import { RangeSlider } from "@skeletonlabs/skeleton"
    import { scalePercent } from "$lib/stores/editor"

    function wheel(e: WheelEvent) {
        e.preventDefault()

        if (e.deltaY > 0) {
            scalePercent.set(Math.max($scalePercent - 5, 25))
        } else if (e.deltaY < 0) {
            scalePercent.set(Math.min($scalePercent + 5, 100))
        }
    }
</script>

<div id="scale-slider-container" 
    class="absolute m-4 bottom-0 w-[200px] variant-glass-primary p-4 rounded">

    <RangeSlider 
        name="scale-slider"
        label="scale-slider"
        accent="accent-primary-500"
        bind:value={$scalePercent} 
        max={100} min={25} step={5}>
        <div class="flex justify-between items-center text-white">
            <div class="font-bold">Scale</div>
            <div class="text-xs">{$scalePercent}%</div>
        </div>
    </RangeSlider>
</div>

<svelte:window on:wheel={wheel} />

<style>
    #scale-slider-container {opacity: 0;}
    #scale-slider-container:hover {opacity: 1;}
</style>