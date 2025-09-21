# 🎤 Voice AI Widget

An embeddable voice AI widget that can be easily integrated into any website with just one script tag. Similar to your chatbot widget, but for voice interactions.

## ✨ Features

- 🎤 **Voice Communication**: Talk directly to AI agents using your microphone
- 🔊 **Real-time Audio**: Hear AI responses in real-time with low latency
- 🎨 **Customizable**: Customize colors, position, and agent
- 📱 **Responsive Design**: Works on desktop and mobile browsers
- 🔒 **Secure**: Uses JWT tokens for authentication
- 🚀 **Easy Integration**: Just one script tag to embed

## 🚀 Quick Start

### 1. Embed the Widget

Add this script tag to your website:

```html
<script 
  src="https://voice-widget.netlify.app/voice-widget.js"
  data-api-url="https://d25b4i9wbz6f8t.cloudfront.net"
  data-api-key="xpectrum-ai@123"
  data-agent="test"
  data-position="bottom-right"
  data-primary-color="#667eea">
</script>
```

### 2. Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-api-url` | Your API endpoint | `https://d25b4i9wbz6f8t.cloudfront.net` |
| `data-api-key` | Your API key | `xpectrum-ai@123` |
| `data-agent` | Agent name to connect to | `test` |
| `data-position` | Widget position | `bottom-right` |
| `data-primary-color` | Primary color (hex) | `#667eea` |

### 3. Position Options

- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`
- `center`

## 🎯 Usage

1. **Click the Voice Button**: Users click the floating voice button
2. **Allow Microphone**: Browser prompts for microphone permission
3. **Start Talking**: Users can speak naturally with the AI
4. **Real-time Response**: AI responds with voice in real-time
5. **End Call**: Users can end the conversation anytime

## 🛠️ Development

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Open [http://localhost:1000](http://localhost:1000)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

### Netlify (Recommended)

1. **Connect your repository** to Netlify
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy!** The widget will be available at your Netlify URL

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Update the widget script URL in your embed code

## 📱 Demo

Visit the demo page to see the widget in action:
- **Local**: [http://localhost:1000/demo](http://localhost:1000/demo)
- **Live**: [https://voice-widget.netlify.app/demo](https://voice-widget.netlify.app/demo)

## 🔧 API Integration

The widget connects to your voice AI backend API. Make sure your API supports:

- **POST** `/tokens/generate?agent_name={agent}` - Generate JWT token
- **Headers**: `X-API-Key: {your-api-key}`
- **Response**: JWT token and LiveKit connection details

## 🎨 Customization

### Colors
Use any hex color for the primary color:
```html
data-primary-color="#ff6b6b"
```

### Multiple Agents
Different pages can use different agents:
```html
<!-- Support page -->
data-agent="support-agent"

<!-- Sales page -->
data-agent="sales-agent"
```

## 🔒 Security

- Uses JWT tokens for secure authentication
- API keys are passed securely via script attributes
- No sensitive data is stored in the widget
- HTTPS required for microphone access

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify your API endpoint is accessible
3. Ensure microphone permissions are granted
4. Test with different browsers

## 🏗️ Architecture

```
Website ←→ Voice Widget ←→ Your API ←→ LiveKit ←→ AI Agent
```

- **Website**: Your website with the embedded script
- **Voice Widget**: This React application
- **Your API**: Your FastAPI backend with voice integration
- **LiveKit**: Real-time audio streaming
- **AI Agent**: Your configured voice AI agent

## 📄 License

This project is part of your voice AI ecosystem. Use it to provide voice AI capabilities to your clients and partners.# voice-widget
