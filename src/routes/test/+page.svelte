<script lang="ts">
    // import tailwind from 'tailwindcss'
    // import postcss from 'postcss'

    let cssClasses: string = ""

    const onChange = async (e: Event) => {
        // console.log(e)
        console.log((await fetch('/test').then(r => r.json())))
    }
</script>

<input type="text" 
    placeholder="class names here" 
    on:input={(e) => onChange(e)}
    bind:value={cssClasses}/>

<div id="css-target" class={cssClasses}>
    Style me!
</div>