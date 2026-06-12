import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Function form (rather than the object/array form) so paths are matched
        // regardless of OS path separators and regardless of which nested package
        // (e.g. react's jsx-runtime, @firebase/*, motion-dom/motion-utils) a
        // dependency is resolved through.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('firebase')) return 'vendor-firebase'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'vendor-motion'
          if (id.includes('react')) return 'vendor-react'
          return undefined
        },
      },
    },
  },
})
