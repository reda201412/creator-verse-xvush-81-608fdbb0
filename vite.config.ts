
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    // Configuration du serveur de développement
    server: {
      host: '::',
      port: 8080,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // Plugins
    plugins: [
      // Support React
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),

      // Taggage des composants en développement
      isDevelopment && componentTagger(),
    ].filter(Boolean),

    // Configuration de la résolution des imports
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@prisma/client': path.resolve(__dirname, './src/lib/client-prisma.ts'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },

    // Optimisation des dépendances
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        'sonner',
      ],
      exclude: ['@prisma/client'],
    },

    // Configuration de la construction
    build: {
      minify: isDevelopment ? false : 'esbuild',
      sourcemap: isDevelopment ? 'inline' : false,
      rollupOptions: {
        external: ['@prisma/client'],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Configuration pour TypeScript - Fixed to resolve TS5094 error
    esbuild: {
      target: 'es2020',
      tsconfigRaw: {
        compilerOptions: {
          noEmit: false,
        },
      },
    },

    // Configuration pour le préchargement des modules
    preview: {
      port: 8080,
      strictPort: true,
    },

    // Variables d'environnement
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
