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
          const path = id.replace(/\\/g, '/')
          // Auth and Functions are only used by the /app check-in flow — keep
          // them out of the chunk the homepage (Firestore-only) depends on.
          if (path.includes('@firebase/auth') || path.includes('firebase/auth')) return 'vendor-firebase-auth'
          if (path.includes('@firebase/functions') || path.includes('firebase/functions')) return 'vendor-firebase-functions'
          if (path.includes('firebase')) return 'vendor-firebase'
          if (path.includes('framer-motion') || path.includes('motion-dom') || path.includes('motion-utils')) return 'vendor-motion'
          if (path.includes('react')) return 'vendor-react'
          return undefined
        },
      },
    },
  },
})
