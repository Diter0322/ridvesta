# Setup & Deployment Guide

## Quick Start

### 1. Installation
```bash
cd ridvesta
npm install
```

### 2. Development
```bash
npm run dev
```
Access at `http://localhost:3000`

### 3. Production Build
```bash
npm run build
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/idvesta-ridvesta/',
  // ... rest of config
})
```

2. Deploy:
```bash
npm run build
git add dist/
git commit -m "Deploy"
git push
```

### Option 4: XAMPP/Local Server
1. Copy `dist/` contents to `htdocs/idvesta/ridvesta/`
2. Access via `http://localhost/idvesta/ridvesta/`

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Idvesta
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t idvesta-app .
docker run -p 80:80 idvesta-app
```

## Performance Optimization

### Image Optimization
```javascript
// Use WebP with fallback
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="..." />
</picture>
```

### Code Splitting
```javascript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Home'));
```

### Build Analysis
```bash
npm run build --report
```

## Monitoring & Analytics

Add tracking:
```javascript
// Google Analytics
import { useEffect } from 'react';
useEffect(() => {
  window.gtag?.pageview({ page_path: location.pathname });
}, []);
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

### CORS Issues
Add proxy in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api/': {
      target: 'http://backend-server',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Build Size
```bash
npm run build --report
```
Check for large dependencies and optimize.

### Performance Issues
- Use React DevTools Profiler
- Check bundle size: `npm list --depth=0`
- Implement code splitting
- Optimize images

## Backup & Recovery

```bash
# Backup dist
cp -r dist dist.backup.$(date +%s)

# Restore
cp -r dist.backup.latest dist
```

## Maintenance

### Update Dependencies
```bash
npm outdated          # Check for updates
npm update            # Update to latest compatible
npm audit fix         # Fix vulnerabilities
```

### Clear Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Rollback

```bash
git reset --hard <commit-hash>
npm install
npm run build
```

---

For more help, check main README.md or https://vitejs.dev
