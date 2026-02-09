import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        allowedHosts: [
            'unalliterated-flyable-lecia.ngrok-free.dev',
            'convenient-sublittoral-calandra.ngrok-free.dev',
            'peaky-vociferously-rose.ngrok-free.dev'
        ]
    }
})



