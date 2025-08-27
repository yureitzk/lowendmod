import webExtension from '@samrum/vite-plugin-web-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { getManifest } from './src/manifest';
import i18nextLoader from 'vite-plugin-i18next-loader';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			i18nextLoader({ paths: ['./locales'], namespaceResolution: 'basename' }),
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
