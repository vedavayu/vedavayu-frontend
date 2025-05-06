import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Open the visualization after build
      filename: 'dist/stats.html', // Output file
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    sourcemap: false, // Set to true for debugging, false for production
    chunkSizeWarningLimit: 500, // Set warning limit to 500kb
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create specific chunks for large vendor libraries
          
          // React and related libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          
          // Chart.js and related visualization libraries
          if (id.includes('node_modules/chart.js') || 
              id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          
          // Individual icons to avoid bundling all lucide icons together
          if (id.includes('node_modules/lucide-react')) {
            // Extract the icon name from the path
            const iconName = id.split('/').pop()?.split('.')[0];
            if (iconName && !id.includes('dist/esm/lucide-react.js')) {
              // Group commonly used icons in one chunk
              const commonIcons = ['Users', 'FileText', 'Clock', 'Activity', 'HeartPulse'];
              if (commonIcons.some(icon => id.includes(icon))) {
                return 'vendor-common-icons';
              }
              // Create separate chunks for other icons
              return 'vendor-icon-' + iconName;
            }
            return 'vendor-icons-core';
          }
          
          // Other utilities
          if (id.includes('node_modules/axios')) {
            return 'vendor-utils';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['lucide-react'], // Force include to ensure proper optimization
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
