# 🚀 Deployment Guide

## Netlify Deployment (Recommended)

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Add voice widget functionality"
   git push origin main
   ```

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign in
2. **Click "New site from Git"**
3. **Connect your repository** (GitHub, GitLab, or Bitbucket)
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
5. **Click "Deploy site"**

### Step 3: Configure Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_API_BASE_URL=https://d25b4i9wbz6f8t.cloudfront.net
   VITE_API_KEY=xpectrum-ai@123
   VITE_DEFAULT_AGENT=test
   ```

### Step 4: Custom Domain (Optional)

1. Go to **Domain settings**
2. Add your custom domain
3. Configure DNS records as instructed

## Manual Deployment

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Upload Files

Upload the contents of the `dist` folder to your web server.

### Step 3: Configure Server

Make sure your server:
- Serves static files correctly
- Has proper CORS headers for iframe embedding
- Supports HTTPS (required for microphone access)

## Testing Your Deployment

### 1. Test the Widget

Visit your deployed URL and test:
- [ ] Widget loads correctly
- [ ] Voice button appears
- [ ] Clicking opens the widget
- [ ] Microphone permission is requested
- [ ] Connection to API works

### 2. Test the Embed Script

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Voice Widget Test</title>
</head>
<body>
    <h1>Test Page</h1>
    <p>This page tests the voice widget integration.</p>
    
    <script 
      src="https://your-domain.netlify.app/voice-widget.js"
      data-api-url="https://d25b4i9wbz6f8t.cloudfront.net"
      data-api-key="xpectrum-ai@123"
      data-agent="test"
      data-position="bottom-right"
      data-primary-color="#667eea">
    </script>
</body>
</html>
```

## Widget Integration Examples

### Basic Integration

```html
<script 
  src="https://voice-widget.netlify.app/voice-widget.js"
  data-api-url="https://d25b4i9wbz6f8t.cloudfront.net"
  data-api-key="xpectrum-ai@123"
  data-agent="test">
</script>
```

### Customized Integration

```html
<script 
  src="https://voice-widget.netlify.app/voice-widget.js"
  data-api-url="https://your-api.com"
  data-api-key="your-api-key"
  data-agent="support-agent"
  data-position="bottom-left"
  data-primary-color="#ff6b6b">
</script>
```

### Multiple Agents

```html
<!-- Support page -->
<script 
  src="https://voice-widget.netlify.app/voice-widget.js"
  data-agent="support-agent"
  data-primary-color="#4CAF50">
</script>

<!-- Sales page -->
<script 
  src="https://voice-widget.netlify.app/voice-widget.js"
  data-agent="sales-agent"
  data-primary-color="#2196F3">
</script>
```

## Troubleshooting

### Common Issues

1. **Widget not loading:**
   - Check if the script URL is correct
   - Verify your domain allows iframe embedding
   - Check browser console for errors

2. **Microphone not working:**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Test in different browsers

3. **API connection failed:**
   - Verify API URL is accessible
   - Check API key is correct
   - Ensure CORS is configured

### Debug Mode

Add `?debug=true` to your widget URL to enable debug logging:

```html
<script 
  src="https://voice-widget.netlify.app/voice-widget.js?debug=true"
  data-api-url="https://d25b4i9wbz6f8t.cloudfront.net"
  data-api-key="xpectrum-ai@123"
  data-agent="test">
</script>
```

## Performance Optimization

### 1. CDN Configuration

Configure your CDN to:
- Cache static assets (JS, CSS, images)
- Enable gzip compression
- Set proper cache headers

### 2. Bundle Optimization

The widget is already optimized with:
- Tree shaking
- Code splitting
- Minification
- Gzip compression

### 3. Loading Strategy

The widget loads asynchronously and doesn't block your page:
- Script loads in background
- Widget appears when ready
- No impact on page performance

## Security Considerations

1. **HTTPS Required**: Microphone access requires HTTPS
2. **API Key Security**: API keys are passed via script attributes
3. **CORS Configuration**: Ensure proper CORS headers
4. **Content Security Policy**: Configure CSP if needed

## Monitoring

### Analytics Integration

Track widget usage:
```javascript
// Track widget opens
window.VoiceWidget.onOpen = function() {
  // Your analytics code
  gtag('event', 'voice_widget_open');
};

// Track widget closes
window.VoiceWidget.onClose = function() {
  // Your analytics code
  gtag('event', 'voice_widget_close');
};
```

### Error Monitoring

Monitor for errors:
```javascript
window.addEventListener('error', function(e) {
  if (e.message.includes('voice-widget')) {
    // Log to your error tracking service
    console.error('Voice widget error:', e);
  }
});
```

## Support

For deployment issues:
1. Check the browser console for errors
2. Verify all configuration parameters
3. Test with different browsers
4. Check network connectivity
5. Review server logs

Your voice widget is now ready to provide AI voice capabilities to any website! 🎉
