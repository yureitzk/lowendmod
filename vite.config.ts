import webExtension from '@samrum/vite-plugin-web-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { getManifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			svelte(),
			webExtension({
				manifest: getManifest(Number(env.MANIFEST_VERSION)),
			}),
		],
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
				'@components': path.resolve(__dirname, './src/lib/components'),
			},
		},
	};
});
