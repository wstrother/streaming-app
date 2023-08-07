<script lang="ts">
    import { RangeSlider } from "@skeletonlabs/skeleton"
    import { scalePercent, wheel } from "$lib/stores/editor"

    
</script>

<div id="scale-slider-container" on:wheel={wheel}
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



<style>
    #scale-slider-container {opacity: 0;}
    #scale-slider-container:hover {opacity: 1;}
</style>