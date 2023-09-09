<script lang="ts">
import { derived, get } from 'svelte/store';
import { layoutNodes } from '$lib/classes/layoutNodes';
import { onMount } from 'svelte';

let css = '';

const classNames = derived(layoutNodes, $layoutNodes => $layoutNodes.map(node => node.classes).join(' '));

let previousClassNames = '';

classNames.subscribe(value => {
  if (value !== previousClassNames) {
    fetch(`/test?css=${value}`)
      .then(response => response.text())
      .then(data => {
        css = data;
      });
    previousClassNames = value;
  }
});

onMount(() => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
});
</script>

<style>{css}</style>