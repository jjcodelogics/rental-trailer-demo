# Deployment Guide

## Vercel Deployment

This project is configured for deployment on Vercel.

### Prerequisites

1. [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional)
3. Git repository

### Initial Setup

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   EMAIL_SERVICE_API_KEY=your_email_api_key
   NOTIFICATION_EMAIL=your_notification_email
   FROM_EMAIL=your_from_email
   ```

### Deployment Commands

**Deploy to production:**
```bash
npm run build
vercel --prod
```

**Deploy to preview:**
```bash
vercel
```

### Vercel Configuration

The project includes a `vercel.json` configuration file that handles:
- API serverless functions routing
- Build settings
- Environment-specific configurations

### Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Performance Monitoring

The project includes:
- **Vercel Analytics**: Page view tracking
- **Vercel Speed Insights**: Core Web Vitals monitoring

Access these in: Vercel Dashboard → Your Project → Analytics

### Troubleshooting

**Build fails:**
- Check Node version compatibility (use Node 18+)
- Verify all dependencies in package.json
- Review build logs in Vercel dashboard

**API functions not working:**
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure API route paths match vercel.json config

**Images not loading:**
- Verify image paths are correct
- Check that images are in the correct directories
- Ensure proper MIME types in vercel.json

## Alternative Deployments

### GitHub Pages

1. Update `vite.config.js` base path:
   ```javascript
   base: '/your-repo-name/'
   ```

2. Build and deploy:
   ```bash
   npm run build
   gh-pages -d dist
   ```

### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify settings

## CI/CD

The project can be configured with GitHub Actions for automated deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```
