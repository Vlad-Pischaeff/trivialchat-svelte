/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
    adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		// hydrate the <div id="svelte"> element in src/app.html
    host: 'localhost',
		target: '#svelte',
    vite: () => ({
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:5001',
            changeOrigin: true,
          }
        }
      }
    })
  },
};

export default config;
