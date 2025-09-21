import { useState, useEffect } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  DisconnectButton, 
  useConnectionState, 
  useParticipants,
  useLocalParticipant,
  useTracks
} from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';

// Configuration - Use environment variables with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || 'xpectrum-ai@123';

// Widget configuration from URL parameters or environment
const getWidgetConfig = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    agentName: urlParams.get('agent') || import.meta.env.VITE_DEFAULT_AGENT || 'test',
    position: urlParams.get('position') || 'bottom-right',
    primaryColor: urlParams.get('primary-color') || '#667eea',
    apiUrl: urlParams.get('api-url') || API_BASE_URL,
    apiKey: urlParams.get('api-key') || API_KEY
  };
};

interface TokenResponse {
  token: string;
  room_name: string;
  agent_name: string;
  livekit_url: string;
  participant_identity: string;
  participant_name: string;
}

function App() {
  const config = getWidgetConfig();
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<TokenResponse | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const connectToAgent = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiUrl}/tokens/generate?agent_name=${config.agentName}`, {
        method: 'POST',
        headers: {
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      setConnectionDetails(data);
      setIsWidgetOpen(true);
    } catch (err) {
      console.error('Failed to connect:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to agent');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setConnectionDetails(null);
    setError(null);
    setIsWidgetOpen(false);
    setIsListening(false);
  };

  if (connectionDetails && isWidgetOpen) {
    return (
      <div className="voice-widget-container">
        <div className="voice-widget">
          <div className="widget-header">
            <div className="agent-info">
              <div className="agent-avatar">
                <div className="pulse-ring"></div>
                <div className="avatar-icon">🤖</div>
              </div>
              <div className="agent-details">
                <h3>Voice Assistant</h3>
                <p>Agent: {connectionDetails.agent_name}</p>
              </div>
            </div>
            <button className="close-btn" onClick={disconnect}>×</button>
          </div>
          
          <LiveKitRoom
            token={connectionDetails.token}
            serverUrl={connectionDetails.livekit_url}
            className="livekit-room"
            audio={true}
            video={false}
            connect={true}
            onDisconnected={disconnect}
          >
            <VoiceWidgetContent onDisconnected={disconnect} />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-widget-launcher">
      <button 
        className={`voice-button ${isConnecting ? 'connecting' : ''}`}
        onClick={connectToAgent}
        disabled={isConnecting}
        style={{ '--primary-color': config.primaryColor } as React.CSSProperties}
      >
        <div className="voice-icon">
          {isConnecting ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </div>
        <span className="voice-text">
          {isConnecting ? 'Connecting...' : 'Voice Assistant'}
        </span>
      </button>
      
      {error && (
        <div className="error-toast">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}

function VoiceWidgetContent({ onDisconnected }: { onDisconnected: () => void }) {
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const { localParticipant: _localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Microphone]);

  // Monitor for room destruction and auto-disconnect
  useEffect(() => {
    if (connectionState === ConnectionState.Connected && participants.length <= 1) {
      const timer = setTimeout(() => {
        if (participants.length <= 1) {
          console.log('Room destroyed - all remote participants left, disconnecting...');
          onDisconnected();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [connectionState, participants.length, onDisconnected]);

  const isMicrophoneActive = tracks.some(track => 
    track.source === Track.Source.Microphone && !(track as any).isMuted
  );

  const getStatusText = () => {
    switch (connectionState) {
      case ConnectionState.Connecting:
        return 'Connecting...';
      case ConnectionState.Connected:
        return isMicrophoneActive ? 'Listening...' : 'Ready to talk';
      case ConnectionState.Reconnecting:
        return 'Reconnecting...';
      case ConnectionState.Disconnected:
        return 'Disconnected';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="widget-content">
      <div className="status-indicator">
        <div className={`status-dot ${connectionState === ConnectionState.Connected ? 'connected' : 'connecting'}`}></div>
        <span className="status-text">{getStatusText()}</span>
      </div>
      
      {connectionState === ConnectionState.Connected && (
        <div className="voice-controls">
          <div className="mic-indicator">
            {isMicrophoneActive ? (
              <div className="mic-active">
                <div className="sound-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
                <span>🎤 Listening</span>
              </div>
            ) : (
              <div className="mic-inactive">
                <span>🔇 Tap to speak</span>
              </div>
            )}
          </div>
          
          <div className="instructions">
            <p>Start speaking to interact with the AI assistant</p>
          </div>
        </div>
      )}
      
      <div className="widget-footer">
        <button className="disconnect-btn" onClick={onDisconnected}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          End Call
        </button>
      </div>
    </div>
  );
}

// Modern Voice Widget Styles
const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .voice-widget-launcher {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
  }

  .voice-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--primary-color, #667eea);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    min-width: 200px;
    justify-content: center;
  }

  .voice-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  .voice-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .voice-button.connecting {
    animation: pulse 2s infinite;
  }

  .voice-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .voice-icon svg {
    width: 100%;
    height: 100%;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-toast {
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: #ff4757;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3);
    animation: slideIn 0.3s ease;
  }

  .error-toast button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .voice-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10001;
  }

  .voice-widget {
    width: 380px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: linear-gradient(135deg, var(--primary-color, #667eea), #764ba2);
    color: white;
  }

  .agent-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .agent-avatar {
    position: relative;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: pulse-ring 2s infinite;
  }

  .avatar-icon {
    font-size: 24px;
    z-index: 1;
  }

  .agent-details h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .agent-details p {
    margin: 4px 0 0 0;
    font-size: 14px;
    opacity: 0.9;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .widget-content {
    padding: 24px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffa726;
    animation: pulse 2s infinite;
  }

  .status-dot.connected {
    background: #4caf50;
  }

  .status-text {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .voice-controls {
    text-align: center;
    margin-bottom: 24px;
  }

  .mic-indicator {
    margin-bottom: 16px;
  }

  .mic-active {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .sound-waves {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .wave {
    width: 4px;
    height: 20px;
    background: var(--primary-color, #667eea);
    border-radius: 2px;
    animation: wave 1.5s ease-in-out infinite;
  }

  .wave:nth-child(2) {
    animation-delay: 0.2s;
  }

  .wave:nth-child(3) {
    animation-delay: 0.4s;
  }

  .mic-inactive {
    color: #666;
    font-size: 16px;
  }

  .instructions {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
  }

  .widget-footer {
    display: flex;
    justify-content: center;
  }

  .disconnect-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .disconnect-btn:hover {
    background: #ff3742;
    transform: translateY(-1px);
  }

  .disconnect-btn svg {
    width: 16px;
    height: 16px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes wave {
    0%, 100% { height: 20px; }
    50% { height: 8px; }
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 480px) {
    .voice-widget {
      width: calc(100vw - 40px);
      margin: 0 20px;
    }
    
    .voice-widget-launcher {
      bottom: 10px;
      right: 10px;
    }
    
    .voice-button {
      min-width: 160px;
      padding: 12px 20px;
      font-size: 14px;
    }
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default App;