import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      // Proxy API requests to the API handlers
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
        // Custom handler for API requests
        bypass: function (req, res) {
          // Check if the request is for an API endpoint
          if (req.url.startsWith('/api/')) {
            const apiPath = req.url.replace(/\?.*$/, '');
            console.log(`API request: ${req.method} ${apiPath}`);
            
            // Map URL to file path
            let filePath;
            if (apiPath === '/api/contact') {
              filePath = path.resolve('./api/contact.js');
            } else if (apiPath === '/api/admission/test') {
              filePath = path.resolve('./api/admission/test.js');
            } else if (apiPath === '/api/mongo-test') {
              filePath = path.resolve('./api/mongo-test.js');
            }
            
            // Check if the file exists
            if (filePath && fs.existsSync(filePath)) {
              console.log(`API endpoint found: ${filePath}`);
              return false; // Let the proxy handle it
            } else {
              console.error(`API endpoint not found: ${filePath}`);
              res.statusCode = 404;
              res.end(`API endpoint not found: ${apiPath}`);
              return true; // Skip the proxy
            }
          }
          return false; // Continue with proxy for non-API requests
        }
      }
    }
  }
})
