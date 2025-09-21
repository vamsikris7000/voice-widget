(function() {
  'use strict';
  
  // Configuration from script attributes
  const script = document.currentScript;
  const config = {
    apiUrl: script.getAttribute('data-api-url') || 'https://d25b4i9wbz6f8t.cloudfront.net',
    apiKey: script.getAttribute('data-api-key') || 'xpectrum-ai@123',
    agent: script.getAttribute('data-agent') || 'test',
    position: script.getAttribute('data-position') || 'bottom-right',
    primaryColor: script.getAttribute('data-primary-color') || '#667eea',
    widgetUrl: script.getAttribute('data-widget-url') || 'https://voice-widget.netlify.app'
  };

  // Create iframe container
  function createWidget() {
    // Remove existing widget if any
    const existingWidget = document.getElementById('voice-widget-container');
    if (existingWidget) {
      existingWidget.remove();
    }

    const container = document.createElement('div');
    container.id = 'voice-widget-container';
    container.style.cssText = `
      position: fixed;
      z-index: 999999;
      ${getPositionStyles(config.position)};
      width: 0;
      height: 0;
      pointer-events: none;
    `;

    const iframe = document.createElement('iframe');
    iframe.id = 'voice-widget-iframe';
    iframe.src = `${config.widgetUrl}?agent=${encodeURIComponent(config.agent)}&api-url=${encodeURIComponent(config.apiUrl)}&api-key=${encodeURIComponent(config.apiKey)}&primary-color=${encodeURIComponent(config.primaryColor)}`;
    iframe.style.cssText = `
      border: none;
      background: transparent;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `;
    iframe.allow = 'microphone';

    container.appendChild(iframe);
    document.body.appendChild(container);

    // Handle iframe resize
    window.addEventListener('message', function(event) {
      if (event.origin !== config.widgetUrl) return;
      
      if (event.data.type === 'resize') {
        const { width, height } = event.data;
        container.style.width = width + 'px';
        container.style.height = height + 'px';
      } else if (event.data.type === 'close') {
        container.remove();
      }
    });
  }

  function getPositionStyles(position) {
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    };
    return positions[position] || positions['bottom-right'];
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  // Expose global API
  window.VoiceWidget = {
    open: createWidget,
    close: function() {
      const container = document.getElementById('voice-widget-container');
      if (container) container.remove();
    }
  };
})();
