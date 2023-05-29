import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glob from 'tiny-glob';

export default glob('./src/**/!(*.spec|*.e2e).{js,svg}').then(async (paths) => {
  return defineConfig({
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    build: {
      target: 'esnext',
      lib: {
        entry: {},
        formats: ['cjs', 'es'],
        fileName(format) {
          return `[name].${format === 'es' ? 'js' : format}`;
        },
      },
      rollupOptions: {
        input: [resolve(__dirname, './src/index.js'), ...paths.map((path) => `./${path}`)],
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: (id) => !id.startsWith('.') && !id.startsWith('/') && !/^\w:/.test(id),
        output: {
          dir: 'dist',
          preserveModules: true,
        },
      },
    },
    plugins: [react()],
  });
});
