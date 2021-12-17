/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
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
