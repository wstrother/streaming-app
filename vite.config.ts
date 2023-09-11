import { sveltekit } from '@sveltejs/kit/vite';
import postcss from './postcss.config.cjs';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom'
	},
	css: {
		postcss,
	}
});
