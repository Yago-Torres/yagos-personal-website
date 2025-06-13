import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			// This is needed for the adapter to work correctly with Cloudflare Workers.
			// It ensures that the paths are correctly resolved in the production environment.
			base: process.env.NODE_ENV === 'cloudflare_pages' ? '' : '',
			assets: process.env.NODE_ENV === 'cloudflare_pages' ? '' : ''
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		csp: {
    		mode: 'disabled'
  		}
	}
};

export default config;