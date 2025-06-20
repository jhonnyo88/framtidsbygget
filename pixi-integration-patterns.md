# PixiJS Integration Patterns - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready  
**Syfte:** Komplett implementationsguide för PixiJS-integration i React-applikationen "Framtidsbygget"

---

## PixiJS Integration Architecture

### Core Integration Philosophy
Framtidsbygget använder en **hybrid arkitektur** där React hanterar UI-state och navigation medan PixiJS hanterar grafisk rendering och game mechanics för interaktiva minispel.

### Key Components
- **GameCanvasWrapper.jsx**: Säker bro mellan React och PixiJS
- **PixiJS Game Classes**: Individuella spelklasser för varje minispel
- **Asset Management**: Centraliserad hantering av grafiska resurser
- **Performance Optimization**: Memory management och rendering optimization

---

## GameCanvasWrapper Implementation

### Complete GameCanvasWrapper.jsx

Baserat på Technical_Masterplan_v4.md specifikation:

```javascript
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

/**
 * GameCanvasWrapper - Säker bro mellan React och PixiJS
 * 
 * Ansvarar för:
 * - PixiJS application lifecycle management
 * - Memory leak prevention
 * - Error boundary för canvas operations
 * - Responsive canvas sizing
 */
const GameCanvasWrapper = ({
  pixiApplicationClass,
  onGameComplete,
  initialData = {},
  width = 800,
  height = 600,
  backgroundColor = 0x1099bb,
  antialias = true,
  powerPreference = "high-performance"
}) => {
  const canvasRef = useRef(null);
  const pixiAppRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // PixiJS Application Setup
  useEffect(() => {
    let mounted = true;

    const initializePixiApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create PixiJS Application
        const app = new PIXI.Application({
          width,
          height,
          backgroundColor,
          antialias,
          powerPreference,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        });

        // Mount canvas to DOM
        if (canvasRef.current && mounted) {
          canvasRef.current.appendChild(app.view);
          pixiAppRef.current = app;

          // Initialize game instance
          const gameInstance = new pixiApplicationClass(
            app, 
            initialData, 
            onGameComplete
          );
          
          gameInstanceRef.current = gameInstance;

          // Start game
          await gameInstance.start();
          
          if (mounted) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('GameCanvasWrapper initialization error:', err);
        if (mounted) {
          setError(err.message || 'Failed to initialize game');
          setIsLoading(false);
        }
      }
    };

    initializePixiApp();

    // Cleanup function - CRITICAL for memory management
    return () => {
      mounted = false;
      
      // Destroy game instance first
      if (gameInstanceRef.current && typeof gameInstanceRef.current.destroy === 'function') {
        try {
          gameInstanceRef.current.destroy();
        } catch (err) {
          console.error('Game instance cleanup error:', err);
        }
        gameInstanceRef.current = null;
      }

      // Destroy PixiJS application
      if (pixiAppRef.current) {
        try {
          pixiAppRef.current.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true
          });
        } catch (err) {
          console.error('PixiJS cleanup error:', err);
        }
        pixiAppRef.current = null;
      }

      // Clear canvas container
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [pixiApplicationClass, width, height, backgroundColor, antialias, powerPreference]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (pixiAppRef.current && gameInstanceRef.current) {
        const container = canvasRef.current?.parentElement;
        if (container) {
          const newWidth = Math.min(container.clientWidth, width);
          const newHeight = Math.min(container.clientHeight, height);
          
          pixiAppRef.current.renderer.resize(newWidth, newHeight);
          
          // Notify game instance of resize
          if (typeof gameInstanceRef.current.handleResize === 'function') {
            gameInstanceRef.current.handleResize(newWidth, newHeight);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Error boundary UI
  if (error) {
    return (
      <div className="game-canvas-error">
        <div className="error-content">
          <h3>Spel kunde inte laddas</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  // Loading state UI
  if (isLoading) {
    return (
      <div className="game-canvas-loading">
        <div className="loading-spinner"></div>
        <p>Laddar spel...</p>
      </div>
    );
  }

  return (
    <div className="game-canvas-container">
      <div 
        ref={canvasRef} 
        className="game-canvas-mount"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default GameCanvasWrapper;
```

### CSS Styles for GameCanvasWrapper

Skapa `src/styles/GameCanvas.css`:

```css
/* GameCanvasWrapper Styles */
.game-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-ui-background);
  border-radius: 12px;
  overflow: hidden;
}

.game-canvas-mount {
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-canvas-mount canvas {
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 61, 130, 0.1);
}

/* Loading State */
.game-canvas-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-brand-secondary);
  border-top: 3px solid var(--color-brand-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-m);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.game-canvas-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxl);
  text-align: center;
}

.error-content {
  max-width: 400px;
}

.error-content h3 {
  color: var(--color-state-danger);
  margin-bottom: var(--space-m);
  font-size: 1.25rem;
}

.error-content p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-l);
  line-height: 1.5;
}

.retry-button {
  background-color: var(--color-brand-primary);
  color: white;
  border: none;
  padding: var(--space-s) var(--space-l);
  border-radius: var(--space-s);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.retry-button:hover {
  filter: brightness(1.1);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .game-canvas-container {
    border-radius: 0;
  }
  
  .game-canvas-mount canvas {
    border-radius: 0;
  }
}
```

---

## PixiJS Game Class Pattern

### Base Game Class Template

Alla PixiJS-spelklasser måste följa detta kontrakt enligt Technical_Masterplan_v4.md:

```javascript
/**
 * BasePixiGame - Abstract base class för alla PixiJS minispel
 * 
 * Detta är mallen som alla spelklasser MÅSTE följa för att fungera
 * med GameCanvasWrapper
 */
class BasePixiGame {
  constructor(pixiApp, initialData, onCompleteCallback) {
    this.app = pixiApp;
    this.initialData = initialData;
    this.onComplete = onCompleteCallback;
    
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    
    // Containers for scene management
    this.gameContainer = new PIXI.Container();
    this.uiContainer = new PIXI.Container();
    
    // Event listeners array for cleanup
    this.eventListeners = [];
    this.timers = [];
    
    // Add containers to stage
    this.app.stage.addChild(this.gameContainer);
    this.app.stage.addChild(this.uiContainer);
  }

  /**
   * REQUIRED: Start method - Sets up and begins the game
   * Must be implemented by each game class
   */
  async start() {
    throw new Error('start() method must be implemented by game class');
  }

  /**
   * REQUIRED: Destroy method - Cleanup for memory management
   * Must be implemented by each game class
   */
  destroy() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];

    // Remove all event listeners
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // Clear containers
    this.gameContainer.removeChildren();
    this.uiContainer.removeChildren();
    
    this.app.stage.removeChild(this.gameContainer);
    this.app.stage.removeChild(this.uiContainer);

    // Mark as not running
    this.isRunning = false;
  }

  /**
   * OPTIONAL: Handle resize events
   */
  handleResize(newWidth, newHeight) {
    // Override in subclasses if needed
  }

  /**
   * Utility: Add tracked event listener
   */
  addEventListenerTracked(target, event, handler) {
    target.addEventListener(event, handler);
    this.eventListeners.push({ target, event, handler });
  }

  /**
   * Utility: Add tracked timer
   */
  addTimerTracked(callback, delay) {
    const timer = setTimeout(callback, delay);
    this.timers.push(timer);
    return timer;
  }

  /**
   * Utility: Complete game with result
   */
  completeGame(result) {
    if (this.isRunning && this.onComplete) {
      this.isRunning = false;
      this.onComplete(result);
    }
  }
}

export default BasePixiGame;
```

### Example Game Implementation

Exempel på hur ett specifikt minispel implementeras:

```javascript
import BasePixiGame from './BasePixiGame.js';
import * as PIXI from 'pixi.js';

/**
 * PuzzleGamePixi - Implementation för "Säker Datasystem" minispel
 * 
 * Följer gameState och result kontrakt från Master_GDD_Complete_Specification.md
 */
class PuzzleGamePixi extends BasePixiGame {
  constructor(pixiApp, initialData, onCompleteCallback) {
    super(pixiApp, initialData, onCompleteCallback);
    
    // Game-specific state
    this.budget = initialData.initialBudget || 10000;
    this.moveCount = 0;
    this.puzzlePieces = [];
    this.isComplete = false;
  }

  async start() {
    try {
      this.isRunning = true;
      
      // Load assets
      await this.loadAssets();
      
      // Setup game scene
      this.setupGameBoard();
      this.setupUI();
      this.setupEventHandlers();
      
      // Start game loop if needed
      this.startGameLoop();
      
    } catch (error) {
      console.error('PuzzleGame start error:', error);
      throw error;
    }
  }

  async loadAssets() {
    // Load game-specific textures and assets
    const loader = PIXI.Loader.shared;
    
    return new Promise((resolve, reject) => {
      loader
        .add('puzzle_background', '/assets/puzzle/background.png')
        .add('puzzle_piece', '/assets/puzzle/piece.png')
        .load((loader, resources) => {
          if (loader.error) {
            reject(loader.error);
          } else {
            this.resources = resources;
            resolve(resources);
          }
        });
    });
  }

  setupGameBoard() {
    // Create game board background
    const background = new PIXI.Sprite(this.resources.puzzle_background.texture);
    background.width = this.app.screen.width;
    background.height = this.app.screen.height;
    this.gameContainer.addChild(background);

    // Create puzzle pieces
    this.createPuzzlePieces();
  }

  createPuzzlePieces() {
    const pieceCount = 9; // 3x3 puzzle
    const pieceSize = 100;
    
    for (let i = 0; i < pieceCount; i++) {
      const piece = new PIXI.Sprite(this.resources.puzzle_piece.texture);
      piece.width = pieceSize;
      piece.height = pieceSize;
      piece.interactive = true;
      piece.buttonMode = true;
      
      // Random initial position
      piece.x = Math.random() * (this.app.screen.width - pieceSize);
      piece.y = Math.random() * (this.app.screen.height - pieceSize);
      
      // Store piece data
      piece.pieceId = i;
      piece.correctX = (i % 3) * pieceSize + 100; // Correct position
      piece.correctY = Math.floor(i / 3) * pieceSize + 100;
      
      // Add drag functionality
      this.makeDraggable(piece);
      
      this.puzzlePieces.push(piece);
      this.gameContainer.addChild(piece);
    }
  }

  makeDraggable(piece) {
    let dragData = null;

    const onDragStart = (event) => {
      this.moveCount++;
      this.updateUI();
      
      dragData = event.data;
      piece.alpha = 0.8;
      piece.dragging = true;
    };

    const onDragMove = (event) => {
      if (piece.dragging) {
        const newPosition = dragData.getLocalPosition(this.gameContainer);
        piece.x = newPosition.x - piece.width / 2;
        piece.y = newPosition.y - piece.height / 2;
      }
    };

    const onDragEnd = () => {
      piece.alpha = 1;
      piece.dragging = false;
      dragData = null;
      
      // Check if piece is in correct position
      this.checkPiecePosition(piece);
      this.checkGameComplete();
    };

    piece.on('pointerdown', onDragStart);
    piece.on('pointermove', onDragMove);
    piece.on('pointerup', onDragEnd);
    piece.on('pointerupoutside', onDragEnd);
  }

  checkPiecePosition(piece) {
    const tolerance = 20;
    const isCorrect = Math.abs(piece.x - piece.correctX) < tolerance && 
                     Math.abs(piece.y - piece.correctY) < tolerance;
    
    if (isCorrect) {
      // Snap to correct position
      piece.x = piece.correctX;
      piece.y = piece.correctY;
      piece.tint = 0x90EE90; // Light green
      piece.interactive = false; // Lock in place
    }
  }

  checkGameComplete() {
    const correctPieces = this.puzzlePieces.filter(piece => 
      piece.x === piece.correctX && piece.y === piece.correctY
    );
    
    if (correctPieces.length === this.puzzlePieces.length && !this.isComplete) {
      this.isComplete = true;
      this.addTimerTracked(() => {
        this.endGame(true);
      }, 1000); // Brief delay for satisfaction
    }
  }

  setupUI() {
    // Budget display
    this.budgetText = new PIXI.Text(`Budget: ${this.budget} kr`, {
      fontSize: 24,
      fill: 0x000000,
      fontFamily: 'Work Sans'
    });
    this.budgetText.x = 20;
    this.budgetText.y = 20;
    this.uiContainer.addChild(this.budgetText);

    // Move counter
    this.moveText = new PIXI.Text(`Drag: ${this.moveCount}`, {
      fontSize: 24,
      fill: 0x000000,
      fontFamily: 'Work Sans'
    });
    this.moveText.x = 20;
    this.moveText.y = 60;
    this.uiContainer.addChild(this.moveText);
  }

  updateUI() {
    if (this.moveText) {
      this.moveText.text = `Drag: ${this.moveCount}`;
    }
  }

  setupEventHandlers() {
    // Example: keyboard shortcuts
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        this.endGame(false);
      }
    };

    this.addEventListenerTracked(window, 'keydown', handleKeyPress);
  }

  startGameLoop() {
    // Optional: Add game loop for animations
    const gameLoop = () => {
      if (!this.isRunning) return;
      
      // Update game logic here
      
      requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  }

  endGame(success) {
    if (!this.isRunning) return;
    
    // Calculate result according to Master GDD specification
    const result = {
      success,
      budgetSpent: this.initialData.initialBudget - this.budget,
      movesMade: this.moveCount
    };
    
    // Complete game with result
    this.completeGame(result);
  }

  handleResize(newWidth, newHeight) {
    // Handle responsive resize if needed
    this.puzzlePieces.forEach(piece => {
      // Adjust positions proportionally
      const scaleX = newWidth / this.app.screen.width;
      const scaleY = newHeight / this.app.screen.height;
      
      piece.x *= scaleX;
      piece.y *= scaleY;
      piece.correctX *= scaleX;
      piece.correctY *= scaleY;
    });
  }

  destroy() {
    // Game-specific cleanup
    this.puzzlePieces.forEach(piece => {
      piece.removeAllListeners();
    });
    this.puzzlePieces = [];
    
    // Call parent destroy
    super.destroy();
  }
}

export default PuzzleGamePixi;
```

---

## Asset Management System

### AssetLoader.js

Centraliserad asset management för performance:

```javascript
import * as PIXI from 'pixi.js';

/**
 * AssetLoader - Centraliserad hantering av speltillgångar
 * 
 * Features:
 * - Lazy loading av assets per minispel
 * - Caching för återanvändning
 * - Progress tracking
 * - Error handling
 */
class AssetLoader {
  constructor() {
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load assets för ett specifikt minispel
   */
  async loadGameAssets(gameId, assetManifest) {
    const cacheKey = `game_${gameId}`;
    
    // Return cached assets if already loaded
    if (this.loadedAssets.has(cacheKey)) {
      return this.loadedAssets.get(cacheKey);
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Start loading
    const loadingPromise = this._loadAssets(assetManifest);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const assets = await loadingPromise;
      this.loadedAssets.set(cacheKey, assets);
      this.loadingPromises.delete(cacheKey);
      return assets;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  async _loadAssets(assetManifest) {
    return new Promise((resolve, reject) => {
      const loader = new PIXI.Loader();

      // Add assets to loader
      assetManifest.forEach(asset => {
        loader.add(asset.name, asset.url);
      });

      // Progress tracking
      loader.onProgress.add((loader, resource) => {
        console.log(`Loading: ${resource.url} (${Math.round(loader.progress)}%)`);
      });

      // Error handling
      loader.onError.add((error, loader, resource) => {
        console.error(`Failed to load asset: ${resource.url}`, error);
      });

      // Complete loading
      loader.load((loader, resources) => {
        if (loader.error) {
          reject(new Error(`Asset loading failed: ${loader.error.message}`));
        } else {
          resolve(resources);
        }
      });
    });
  }

  /**
   * Unload assets för specifikt spel (memory management)
   */
  unloadGameAssets(gameId) {
    const cacheKey = `game_${gameId}`;
    const assets = this.loadedAssets.get(cacheKey);
    
    if (assets) {
      // Destroy textures to free memory
      Object.values(assets).forEach(resource => {
        if (resource.texture) {
          resource.texture.destroy(true);
        }
      });
      
      this.loadedAssets.delete(cacheKey);
    }
  }

  /**
   * Get pre-loaded assets
   */
  getGameAssets(gameId) {
    const cacheKey = `game_${gameId}`;
    return this.loadedAssets.get(cacheKey);
  }

  /**
   * Clear all cached assets
   */
  clearCache() {
    this.loadedAssets.forEach((assets, gameId) => {
      this.unloadGameAssets(gameId.replace('game_', ''));
    });
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export default new AssetLoader();
```

### Asset Manifest Files

Skapa asset manifests för varje minispel. Exempel för pusselspelet:

`src/assets/manifests/puzzle-game-assets.json`:

```json
[
  {
    "name": "puzzle_background",
    "url": "/assets/puzzle/background.png"
  },
  {
    "name": "puzzle_piece_01",
    "url": "/assets/puzzle/piece_01.png"
  },
  {
    "name": "puzzle_piece_02", 
    "url": "/assets/puzzle/piece_02.png"
  },
  {
    "name": "puzzle_success_sound",
    "url": "/assets/audio/success.mp3"
  },
  {
    "name": "puzzle_move_sound",
    "url": "/assets/audio/move.wav"
  }
]
```

---

## Performance Optimization

### Memory Management Best Practices

```javascript
/**
 * PixiPerformanceManager - Optimizationsverktyg för PixiJS
 */
class PixiPerformanceManager {
  constructor() {
    this.textureCache = new Map();
    this.spritePool = new Map();
  }

  /**
   * Texture sharing för identiska sprites
   */
  getSharedTexture(key, textureSource) {
    if (!this.textureCache.has(key)) {
      const texture = PIXI.Texture.from(textureSource);
      this.textureCache.set(key, texture);
    }
    return this.textureCache.get(key);
  }

  /**
   * Object pooling för sprites som skapas/förstörs ofta
   */
  getSpriteFromPool(poolKey, textureKey) {
    if (!this.spritePool.has(poolKey)) {
      this.spritePool.set(poolKey, []);
    }

    const pool = this.spritePool.get(poolKey);
    
    if (pool.length > 0) {
      return pool.pop();
    } else {
      const texture = this.getSharedTexture(textureKey, textureKey);
      return new PIXI.Sprite(texture);
    }
  }

  /**
   * Return sprite to pool instead of destroying
   */
  returnSpriteToPool(poolKey, sprite) {
    if (!this.spritePool.has(poolKey)) {
      this.spritePool.set(poolKey, []);
    }

    // Reset sprite properties
    sprite.visible = true;
    sprite.alpha = 1;
    sprite.rotation = 0;
    sprite.scale.set(1);
    sprite.tint = 0xFFFFFF;
    
    // Remove from parent
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }

    this.spritePool.get(poolKey).push(sprite);
  }

  /**
   * Batch sprite updates för better performance
   */
  batchUpdateSprites(sprites, updateFunction) {
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      sprites.forEach(updateFunction);
    });
  }

  /**
   * Monitor performance metrics
   */
  getPerformanceMetrics() {
    return {
      texturesInCache: this.textureCache.size,
      spritesInPools: Array.from(this.spritePool.values())
        .reduce((total, pool) => total + pool.length, 0),
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      } : null
    };
  }

  /**
   * Clean up cached resources
   */
  cleanup() {
    // Clear texture cache
    this.textureCache.forEach(texture => texture.destroy(true));
    this.textureCache.clear();

    // Clear sprite pools
    this.spritePool.forEach(pool => {
      pool.forEach(sprite => sprite.destroy());
    });
    this.spritePool.clear();
  }
}

export default new PixiPerformanceManager();
```

---

## Error Handling & Debugging

### PixiJS Error Boundary

```javascript
import React from 'react';

/**
 * PixiErrorBoundary - Specialized error boundary för PixiJS components
 */
class PixiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PixiJS Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="pixi-error-boundary">
          <div className="error-content">
            <h2>🎮 Spelet kunde inte laddas</h2>
            <p>Ett tekniskt fel uppstod. Försök att ladda om sidan.</p>
            <button 
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Ladda om sidan
            </button>
            
            {import.meta.env.VITE_NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Teknisk information (utvecklingsläge)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PixiErrorBoundary;
```

### Debug Utilities

```javascript
/**
 * PixiDebugUtils - Development debugging tools
 */
class PixiDebugUtils {
  constructor() {
    this.debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
  }

  /**
   * Add debug overlay to show performance stats
   */
  addDebugOverlay(pixiApp) {
    if (!this.debugMode) return;

    const debugText = new PIXI.Text('Debug Info', {
      fontSize: 12,
      fill: 0x00FF00,
      fontFamily: 'monospace'
    });
    
    debugText.x = 10;
    debugText.y = pixiApp.screen.height - 100;
    pixiApp.stage.addChild(debugText);

    // Update debug info every second
    setInterval(() => {
      const stats = {
        FPS: Math.round(PIXI.Ticker.shared.FPS),
        Objects: pixiApp.stage.children.length,
        Memory: performance.memory ? 
          Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 
          'N/A'
      };

      debugText.text = Object.entries(stats)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }, 1000);

    return debugText;
  }

  /**
   * Log game state for debugging
   */
  logGameState(gameInstance, label = 'Game State') {
    if (!this.debugMode) return;
    
    console.group(`🎮 ${label}`);
    console.log('Game Instance:', gameInstance);
    console.log('Is Running:', gameInstance.isRunning);
    console.log('Container Children:', gameInstance.gameContainer.children.length);
    console.log('Event Listeners:', gameInstance.eventListeners.length);
    console.log('Active Timers:', gameInstance.timers.length);
    console.groupEnd();
  }

  /**
   * Visualize hitboxes for debugging interactions
   */
  showHitboxes(container) {
    if (!this.debugMode) return;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFF0000, 0.5);

    container.children.forEach(child => {
      if (child.interactive) {
        const bounds = child.getBounds();
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
      }
    });

    container.addChild(graphics);
    return graphics;
  }
}

export default new PixiDebugUtils();
```

---

## Integration Checklist

### Pre-Implementation Checklist

- [ ] GameCanvasWrapper.jsx implementerad och testad
- [ ] BasePixiGame template skapad
- [ ] AssetLoader system implementerat
- [ ] PixiPerformanceManager konfigurerad
- [ ] PixiErrorBoundary skapad
- [ ] CSS styles för game canvas implementerade
- [ ] Asset manifests skapade för alla minispel

### Per Minispel Checklist

- [ ] Spelklass extends BasePixiGame
- [ ] `start()` method implementerad
- [ ] `destroy()` method implementerad
- [ ] Asset loading via AssetLoader
- [ ] Event listeners tracked för cleanup
- [ ] Result object följer GDD specification
- [ ] Memory management implementerad
- [ ] Error handling för alla kritiska operationer
- [ ] Responsive design för olika skärmstorlekar

### Performance Checklist

- [ ] Texture sharing implementerat
- [ ] Object pooling för återkommande sprites
- [ ] Proper cleanup i destroy() methods
- [ ] Asset unloading efter minispel
- [ ] Memory usage monitoring
- [ ] FPS monitoring i debug mode

---

## Production Deployment

### Build Optimization

Lägg till följande i `vite.config.js` för PixiJS optimization:

```javascript
export default {
  // ... other config
  build: {
    rollupOptions: {
      external: ['pixi.js'],
      output: {
        globals: {
          'pixi.js': 'PIXI'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pixi.js']
  }
}
```

### Asset Optimization

- **Textures**: Använd WebP format för bättre kompression
- **Sprites**: Kombinera små sprites i texture atlases
- **Audio**: Komprimera ljud till OGG/MP3 för web
- **Preloading**: Implementera progressive loading för bättre UX

---

**Integration Complete:** PixiJS-integrationen är nu redo för produktion med full memory management, error handling och performance optimization.