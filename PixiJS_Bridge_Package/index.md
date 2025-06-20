# PixiJS Bridge Package

**Package ID:** S3  
**System:** React-PixiJS Integration Bridge  
**Status:** Complete  
**Token Count:** ~24,000 tokens

---

## Package Contents

### Architecture Documentation
- `/architecture/GameCanvasWrapper_Design.md` - Core bridge component design
- `/architecture/State_Sync_Pattern.md` - React-PixiJS state synchronization
- `/architecture/Performance_Strategy.md` - Rendering optimization patterns

### Implementation Guides
- `/implementation/GameCanvasWrapper_Guide.md` - Step-by-step implementation
- `/implementation/PixiJS_Setup.md` - PixiJS configuration for React
- `/implementation/Asset_Management.md` - Loading and managing game assets
- `/implementation/Animation_Patterns.md` - React-controlled animations

### Reference Code
- `/reference/components/GameCanvasWrapper.jsx` - Core bridge component
- `/reference/hooks/usePixiApp.js` - PixiJS app management hook
- `/reference/hooks/useGameLoop.js` - Game loop integration
- `/reference/utils/assetLoader.js` - Asset loading utilities

---

## Quick Start

```jsx
import { GameCanvasWrapper } from '@/components/GameCanvasWrapper';
import { usePixiApp } from '@/hooks/usePixiApp';

function PuzzleGame() {
  const gameState = useSelector(selectPuzzleState);
  
  const handleGameReady = (app) => {
    // PixiJS app is ready
    setupGameScene(app);
  };
  
  const handleGameUpdate = (app, delta) => {
    // Called every frame
    updateGameLogic(delta);
  };
  
  return (
    <GameCanvasWrapper
      width={800}
      height={600}
      onReady={handleGameReady}
      onUpdate={handleGameUpdate}
      gameState={gameState}
    />
  );
}
```

---

## Key Features

### GameCanvasWrapper Component
- **Seamless Integration**: React component wrapping PixiJS
- **Lifecycle Management**: Proper setup and cleanup
- **State Bridge**: Automatic state synchronization
- **Performance**: Optimized rendering pipeline
- **Responsive**: Handles resize and orientation

### State Synchronization
- **Unidirectional Flow**: React → PixiJS
- **Selective Updates**: Only sync changed properties
- **Batched Rendering**: Group updates per frame
- **Type Safety**: TypeScript interfaces

### Asset Management
- **Preloading**: Load assets before game start
- **Caching**: Efficient texture management
- **Progress Tracking**: Loading UI integration
- **Error Handling**: Graceful fallbacks

---

## Core Architecture

### GameCanvasWrapper Design
```jsx
const GameCanvasWrapper = ({
  width,
  height,
  backgroundColor = 0x1099bb,
  antialias = false,
  gameState,
  onReady,
  onUpdate,
  onDestroy,
  children
}) => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  
  // Initialize PixiJS
  useEffect(() => {
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor,
      antialias,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    
    containerRef.current.appendChild(app.view);
    appRef.current = app;
    
    if (onReady) {
      onReady(app);
    }
    
    // Cleanup
    return () => {
      if (onDestroy) {
        onDestroy(app);
      }
      app.destroy(true, { children: true, texture: true });
    };
  }, []);
  
  // Game loop
  useEffect(() => {
    if (!appRef.current || !onUpdate) return;
    
    const ticker = appRef.current.ticker;
    ticker.add(onUpdate);
    
    return () => {
      ticker.remove(onUpdate);
    };
  }, [onUpdate]);
  
  // State synchronization
  useEffect(() => {
    if (!appRef.current || !gameState) return;
    
    // Update PixiJS objects based on React state
    syncStateToPixi(appRef.current, gameState);
  }, [gameState]);
  
  return (
    <div ref={containerRef} className="game-canvas-container">
      {children}
    </div>
  );
};
```

### State Bridge Pattern
```javascript
// State synchronization utility
const syncStateToPixi = (app, gameState) => {
  const stage = app.stage;
  
  // Update only changed entities
  gameState.entities.forEach(entity => {
    let sprite = stage.getChildByName(entity.id);
    
    if (!sprite) {
      // Create new sprite
      sprite = createSprite(entity);
      stage.addChild(sprite);
    }
    
    // Update properties
    if (entity.x !== sprite.x) sprite.x = entity.x;
    if (entity.y !== sprite.y) sprite.y = entity.y;
    if (entity.rotation !== sprite.rotation) {
      sprite.rotation = entity.rotation;
    }
    if (entity.visible !== sprite.visible) {
      sprite.visible = entity.visible;
    }
  });
  
  // Remove deleted entities
  stage.children.forEach(child => {
    if (!gameState.entities.find(e => e.id === child.name)) {
      stage.removeChild(child);
    }
  });
};
```

---

## React Hooks

### usePixiApp Hook
```javascript
export function usePixiApp(config = {}) {
  const [app, setApp] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const pixiApp = new PIXI.Application({
      width: config.width || 800,
      height: config.height || 600,
      ...config
    });
    
    containerRef.current.appendChild(pixiApp.view);
    setApp(pixiApp);
    setIsReady(true);
    
    return () => {
      pixiApp.destroy(true);
      setApp(null);
      setIsReady(false);
    };
  }, []);
  
  return { app, isReady, containerRef };
}
```

### useGameLoop Hook
```javascript
export function useGameLoop(callback, deps = []) {
  const callbackRef = useRef(callback);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    const loop = (timestamp) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = timestamp - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      
      previousTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(loop);
    };
    
    requestRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
}
```

---

## Asset Management

### Asset Loader
```javascript
class AssetLoader {
  constructor() {
    this.loader = PIXI.Loader.shared;
    this.assets = new Map();
  }
  
  async loadGameAssets(manifest) {
    return new Promise((resolve, reject) => {
      // Add assets to loader
      manifest.forEach(asset => {
        this.loader.add(asset.name, asset.url);
      });
      
      // Set up progress tracking
      this.loader.onProgress.add((loader, resource) => {
        const progress = loader.progress;
        store.dispatch(updateLoadingProgress(progress));
      });
      
      // Load assets
      this.loader.load((loader, resources) => {
        // Cache loaded textures
        Object.keys(resources).forEach(key => {
          this.assets.set(key, resources[key].texture);
        });
        
        resolve(resources);
      });
      
      this.loader.onError.add(reject);
    });
  }
  
  getTexture(name) {
    return this.assets.get(name);
  }
}

// Usage
const assetManifest = [
  { name: 'player', url: '/assets/sprites/player.png' },
  { name: 'enemy', url: '/assets/sprites/enemy.png' },
  { name: 'background', url: '/assets/backgrounds/game-bg.jpg' }
];

await assetLoader.loadGameAssets(assetManifest);
```

---

## Performance Optimization

### Render Optimization
```javascript
// Object pooling for performance
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = new Set();
    
    // Pre-populate pool
    for (let i = 0; i < maxSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  acquire() {
    let obj = this.pool.pop();
    if (!obj) {
      obj = this.createFn();
    }
    this.active.add(obj);
    return obj;
  }
  
  release(obj) {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Usage for particles
const particlePool = new ObjectPool(
  () => new PIXI.Sprite(texture),
  (sprite) => {
    sprite.x = 0;
    sprite.y = 0;
    sprite.alpha = 1;
    sprite.visible = false;
  }
);
```

### Batch Updates
```javascript
// Batch state updates for performance
const batchedUpdates = (() => {
  let pending = [];
  let rafId = null;
  
  const flush = () => {
    const updates = pending;
    pending = [];
    rafId = null;
    
    // Apply all updates in single frame
    updates.forEach(update => update());
  };
  
  return (update) => {
    pending.push(update);
    
    if (!rafId) {
      rafId = requestAnimationFrame(flush);
    }
  };
})();
```

---

## Common Patterns

### Responsive Canvas
```javascript
const makeResponsive = (app, container) => {
  const resize = () => {
    const parent = container.parentElement;
    const { width, height } = parent.getBoundingClientRect();
    
    app.renderer.resize(width, height);
    app.stage.scale.set(width / 800, height / 600);
  };
  
  window.addEventListener('resize', resize);
  resize();
  
  return () => window.removeEventListener('resize', resize);
};
```

### Animation Control
```javascript
// React-controlled animations
const usePixiAnimation = (sprite, animation) => {
  useEffect(() => {
    if (!sprite || !animation) return;
    
    const ticker = PIXI.Ticker.shared;
    const animate = (delta) => {
      animation(sprite, delta);
    };
    
    ticker.add(animate);
    return () => ticker.remove(animate);
  }, [sprite, animation]);
};
```

---

## Best Practices

1. **Separate Concerns**: Keep game logic in React, rendering in PixiJS
2. **Minimize State Sync**: Only sync necessary properties
3. **Use Object Pools**: Reuse sprites for performance
4. **Batch Updates**: Group render updates
5. **Clean Up Properly**: Destroy PixiJS resources
6. **Type Everything**: Use TypeScript for safety
7. **Profile Performance**: Use PixiJS and React DevTools

---

## Related Packages

- **S1**: State Management (game state source)
- **G1-G4**: Game Modules (specific game implementations)
- **F3**: Advanced UI (animation patterns)
- **S4**: Testing (PixiJS testing strategies)