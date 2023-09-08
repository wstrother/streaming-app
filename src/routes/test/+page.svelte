<script lang="ts">
    // import tailwind from 'tailwindcss'
    // import postcss from 'postcss'

    let cssClasses: string = ""
    let compiledCss: string = ""

    const onChange = async (e: Event) => {
        compiledCss = (
            await fetch(`/test?css=${cssClasses}`).then(r => r.json())
        ).output
        console.log(compiledCss)
    }
</script>

<svelte:head>
    {@html `<style type="text/css">${compiledCss}</style>`}
</svelte:head>

<input type="text" 
    placeholder="class names here" 
    on:input={(e) => onChange(e)}
    bind:value={cssClasses}/>

<div id="css-target" class={cssClasses}>
    Style me!
</div>