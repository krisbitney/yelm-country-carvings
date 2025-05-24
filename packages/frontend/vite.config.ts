import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import { compression } from 'vite-plugin-compression2';
import { createHtmlPlugin } from 'vite-plugin-html';

const ReactCompilerConfig = {
  target: '19',
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    svgr(),
    tailwindcss(),
    // Optimize images
    ViteImageOptimizer({
      includePublic: true,
      logStats: true,
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,
        quality: 85,
      },
    }),
    // Generate compressed versions of assets
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Add preload/prefetch hints to HTML
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          preloadFonts: ['/fonts/Cinzel-Regular.woff2', '/fonts/Lato-Regular.woff2'],
        },
      },
    }),
  ],
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Generate sourcemaps for production
    sourcemap: true,
    rollupOptions: {
      output: {
        // Customize chunk naming
        manualChunks: id => {
          if (id.includes('components/ui')) {
            return 'shared-components';
          }

          if (id.includes('admin')) {
            return 'admin';
          }

          if (id.includes('landing-page')) {
            return 'landing-page';
          }

          return undefined;
        },
        // Add hashes to file names for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
