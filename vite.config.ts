
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy API requests to our Express server
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Replace @prisma/client with our client-side implementation
        '@prisma/client': path.resolve(__dirname, './src/lib/client-prisma.ts'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'sonner',
      ],
      exclude: ['@prisma/client'],
    },
    build: {
      rollupOptions: {
        external: ['@prisma/client'],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
