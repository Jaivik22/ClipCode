//run this command to build project after every changes : npx vite build

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: './src/popup.js', // Include popup.js as an entry point
        firebase: './src/firebase.js',
      },
      output: {
        entryFileNames: '[name]-bundle.js', // Generates firebase-bundle.js and popup-bundle.js
      },
    },
  },
  resolve: {
    alias: {
      // Ensure Firebase modules are resolved correctly
      'firebase/app': 'firebase/app',
      'firebase/firestore': 'firebase/firestore',
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore'], // Pre-bundle Firebase dependencies
  },
});