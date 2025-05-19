import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  return {
    server: {
      host: "::",
      port: 3000,
    },
    plugins: [
      react({
        // Utilise la nouvelle API JSX transform
        jsxImportSource: 'react',
      }),
      isDevelopment && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Remplace @prisma/client par notre implémentation côté client
        '@prisma/client': path.resolve(__dirname, './src/lib/client-prisma.ts'),
        // Alias pour React
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
    },
    optimizeDeps: {
      include: [
        // Inclure les dépendances nécessitant une optimisation
        'react',
        'react-dom',
        'sonner',
      ],
      // Ne pas exclure React de l'optimisation
      exclude: ['@prisma/client'],
      esbuildOptions: {
        // Assure que les imports de React utilisent la même instance
        jsx: 'automatic',
      },
    },
    ssr: {
      noExternal: ['@prisma/client'],
    },
    build: {
      rollupOptions: {
        external: ['@prisma/client'],
        output: {
          // Assure que les imports de React sont correctement gérés
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
