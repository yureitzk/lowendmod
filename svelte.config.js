import sveltePreprocess from 'svelte-preprocess';

export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [sveltePreprocess({ typescript: true })],
	extensions: ['.svelte'],
	compilerOptions: {},
	onwarn: (warning, handler) => handler(warning),
	// plugin options
	vitePlugin: {
		exclude: [],
		// experimental options
		experimental: {},
	},
};
