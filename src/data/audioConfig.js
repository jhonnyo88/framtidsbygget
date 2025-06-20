/**
 * Audio Configuration - Framtidsbygget
 * 
 * Complete audio system configuration with volume controls and preloading
 */

export const audioConfig = {
  // =============================================================================
  // AUDIO CATEGORIES
  // =============================================================================
  categories: {
    ui: {
      name: "UI Sounds",
      defaultVolume: 0.6,
      description: "User interface interaction sounds"
    },
    ambient: {
      name: "Ambient Music",
      defaultVolume: 0.4,
      description: "Background music and atmosphere"
    },
    feedback: {
      name: "Game Feedback",
      defaultVolume: 0.7,
      description: "Success, error, and notification sounds"
    },
    dialogue: {
      name: "Dialogue",
      defaultVolume: 0.8,
      description: "Character speech and narration"
    }
  },

  // =============================================================================
  // AUDIO ASSETS MANIFEST
  // =============================================================================
  sounds: {
    // UI Sounds
    ui: {
      click: {
        file: "/assets/audio/ui/click.mp3",
        volume: 0.5,
        preload: true,
        category: "ui"
      },
      hover: {
        file: "/assets/audio/ui/hover.mp3",
        volume: 0.3,
        preload: true,
        category: "ui"
      },
      modalOpen: {
        file: "/assets/audio/ui/modal-open.mp3",
        volume: 0.6,
        preload: true,
        category: "ui"
      },
      modalClose: {
        file: "/assets/audio/ui/modal-close.mp3",
        volume: 0.6,
        preload: true,
        category: "ui"
      },
      pageTurn: {
        file: "/assets/audio/ui/page-turn.mp3",
        volume: 0.5,
        preload: true,
        category: "ui"
      },
      navigationBack: {
        file: "/assets/audio/ui/navigation-back.mp3",
        volume: 0.4,
        preload: true,
        category: "ui"
      },
      navigationForward: {
        file: "/assets/audio/ui/navigation-forward.mp3",
        volume: 0.4,
        preload: true,
        category: "ui"
      }
    },

    // Feedback Sounds
    feedback: {
      success: {
        file: "/assets/audio/feedback/success.mp3",
        volume: 0.7,
        preload: true,
        category: "feedback"
      },
      error: {
        file: "/assets/audio/feedback/error.mp3",
        volume: 0.6,
        preload: true,
        category: "feedback"
      },
      notification: {
        file: "/assets/audio/feedback/notification.mp3",
        volume: 0.8,
        preload: true,
        category: "feedback"
      },
      unlock: {
        file: "/assets/audio/feedback/unlock.mp3",
        volume: 0.8,
        preload: true,
        category: "feedback"
      },
      achievement: {
        file: "/assets/audio/feedback/achievement.mp3",
        volume: 0.9,
        preload: false,
        category: "feedback"
      },
      levelComplete: {
        file: "/assets/audio/feedback/level-complete.mp3",
        volume: 1.0,
        preload: false,
        category: "feedback"
      },
      gameOver: {
        file: "/assets/audio/feedback/game-over.mp3",
        volume: 0.8,
        preload: false,
        category: "feedback"
      }
    },

    // Ambient Music
    ambient: {
      mainMenu: {
        file: "/assets/audio/ambient/main-ambient.mp3",
        volume: 0.4,
        loop: true,
        fadeIn: 2000,
        fadeOut: 1000,
        preload: true,
        category: "ambient"
      },
      onboarding: {
        file: "/assets/audio/ambient/onboarding-warm.mp3",
        volume: 0.3,
        loop: true,
        fadeIn: 1500,
        fadeOut: 1000,
        preload: false,
        category: "ambient"
      },
      puzzle: {
        file: "/assets/audio/ambient/puzzle-focused.mp3",
        volume: 0.35,
        loop: true,
        fadeIn: 1000,
        fadeOut: 800,
        preload: false,
        category: "ambient"
      },
      welfare: {
        file: "/assets/audio/ambient/welfare-empathetic.mp3",
        volume: 0.3,
        loop: true,
        fadeIn: 1500,
        fadeOut: 1000,
        preload: false,
        category: "ambient"
      },
      competence: {
        file: "/assets/audio/ambient/competence-strategic.mp3",
        volume: 0.35,
        loop: true,
        fadeIn: 1000,
        fadeOut: 800,
        preload: false,
        category: "ambient"
      },
      connectivity: {
        file: "/assets/audio/ambient/connectivity-tense.mp3",
        volume: 0.4,
        loop: true,
        fadeIn: 500,
        fadeOut: 500,
        dynamicIntensity: true,
        preload: false,
        category: "ambient"
      },
      ecosystem: {
        file: "/assets/audio/ambient/ecosystem-grand.mp3",
        volume: 0.45,
        loop: true,
        fadeIn: 2000,
        fadeOut: 1500,
        preload: false,
        category: "ambient"
      },
      finale: {
        file: "/assets/audio/ambient/finale-triumphant.mp3",
        volume: 0.5,
        loop: false,
        fadeIn: 3000,
        fadeOut: 2000,
        preload: false,
        category: "ambient"
      }
    },

    // Game-Specific Sounds
    games: {
      // Puzzle Game
      puzzle: {
        connectionStart: {
          file: "/assets/audio/puzzle/connection-start.mp3",
          volume: 0.5,
          category: "feedback"
        },
        connectionSuccess: {
          file: "/assets/audio/puzzle/connection-success.mp3",
          volume: 0.7,
          category: "feedback"
        },
        connectionError: {
          file: "/assets/audio/puzzle/connection-error.mp3",
          volume: 0.6,
          category: "feedback"
        },
        modernizationComplete: {
          file: "/assets/audio/puzzle/modernization-complete.mp3",
          volume: 0.8,
          category: "feedback"
        },
        securityAlert: {
          file: "/assets/audio/puzzle/security-alert.mp3",
          volume: 0.9,
          category: "feedback"
        },
        puzzleComplete: {
          file: "/assets/audio/puzzle/puzzle-complete.mp3",
          volume: 1.0,
          category: "feedback"
        }
      },

      // Welfare Game
      welfare: {
        dialogueAdvance: {
          file: "/assets/audio/welfare/dialogue-advance.mp3",
          volume: 0.4,
          category: "ui"
        },
        choiceSelect: {
          file: "/assets/audio/welfare/choice-select.mp3",
          volume: 0.5,
          category: "ui"
        },
        consensusReached: {
          file: "/assets/audio/welfare/consensus-reached.mp3",
          volume: 0.9,
          category: "feedback"
        },
        relationshipImprove: {
          file: "/assets/audio/welfare/relationship-improve.mp3",
          volume: 0.6,
          category: "feedback"
        },
        relationshipWorsen: {
          file: "/assets/audio/welfare/relationship-worsen.mp3",
          volume: 0.6,
          category: "feedback"
        },
        emotionChange: {
          file: "/assets/audio/welfare/emotion-change.mp3",
          volume: 0.4,
          category: "feedback"
        }
      },

      // Competence Game
      competence: {
        cardDraw: {
          file: "/assets/audio/competence/card-draw.mp3",
          volume: 0.5,
          category: "ui"
        },
        trainingComplete: {
          file: "/assets/audio/competence/training-complete.mp3",
          volume: 0.7,
          category: "feedback"
        },
        budgetSpent: {
          file: "/assets/audio/competence/budget-spent.mp3",
          volume: 0.6,
          category: "feedback"
        },
        eventTrigger: {
          file: "/assets/audio/competence/event-trigger.mp3",
          volume: 0.8,
          category: "feedback"
        },
        competenceMilestone: {
          file: "/assets/audio/competence/competence-milestone.mp3",
          volume: 0.9,
          category: "feedback"
        },
        monthAdvance: {
          file: "/assets/audio/competence/month-advance.mp3",
          volume: 0.4,
          category: "ui"
        }
      },

      // Connectivity Game
      connectivity: {
        infrastructureBuild: {
          file: "/assets/audio/connectivity/infrastructure-build.mp3",
          volume: 0.6,
          category: "feedback"
        },
        crisisAlert: {
          file: "/assets/audio/connectivity/crisis-alert.mp3",
          volume: 1.0,
          category: "feedback"
        },
        systemRepair: {
          file: "/assets/audio/connectivity/system-repair.mp3",
          volume: 0.7,
          category: "feedback"
        },
        resilienceAchieved: {
          file: "/assets/audio/connectivity/resilience-achieved.mp3",
          volume: 0.9,
          category: "feedback"
        },
        connectionLost: {
          file: "/assets/audio/connectivity/connection-lost.mp3",
          volume: 0.8,
          category: "feedback"
        },
        warningBeep: {
          file: "/assets/audio/connectivity/warning-beep.mp3",
          volume: 0.7,
          loop: true,
          category: "feedback"
        }
      },

      // Ecosystem Game
      ecosystem: {
        policyImplement: {
          file: "/assets/audio/ecosystem/policy-implement.mp3",
          volume: 0.7,
          category: "feedback"
        },
        companyGrowth: {
          file: "/assets/audio/ecosystem/company-growth.mp3",
          volume: 0.6,
          category: "feedback"
        },
        marketEvent: {
          file: "/assets/audio/ecosystem/market-event.mp3",
          volume: 0.8,
          category: "feedback"
        },
        unicornCreated: {
          file: "/assets/audio/ecosystem/unicorn-created.mp3",
          volume: 1.0,
          category: "feedback"
        },
        quarterAdvance: {
          file: "/assets/audio/ecosystem/quarter-advance.mp3",
          volume: 0.5,
          category: "ui"
        },
        innovationBoost: {
          file: "/assets/audio/ecosystem/innovation-boost.mp3",
          volume: 0.7,
          category: "feedback"
        }
      }
    }
  },

  // =============================================================================
  // AUDIO ENGINE CONFIGURATION
  // =============================================================================
  engine: {
    // Audio context settings
    context: {
      latencyHint: "interactive",
      sampleRate: 44100
    },
    
    // Master settings
    master: {
      volume: 1.0,
      compressor: {
        threshold: -24,
        knee: 30,
        ratio: 12,
        attack: 0.003,
        release: 0.25
      }
    },
    
    // Preload settings
    preload: {
      strategy: "progressive", // "all", "progressive", "lazy"
      batchSize: 5,
      timeout: 10000
    },
    
    // Performance settings
    performance: {
      maxSimultaneousSounds: 10,
      recycleThreshold: 0.1, // Recycle sounds below this volume
      fadeQuality: "high" // "low", "medium", "high"
    }
  },

  // =============================================================================
  // VOLUME PRESETS
  // =============================================================================
  presets: {
    default: {
      master: 1.0,
      ui: 0.6,
      ambient: 0.4,
      feedback: 0.7,
      dialogue: 0.8
    },
    quiet: {
      master: 0.5,
      ui: 0.3,
      ambient: 0.2,
      feedback: 0.4,
      dialogue: 0.5
    },
    loud: {
      master: 1.0,
      ui: 0.8,
      ambient: 0.6,
      feedback: 0.9,
      dialogue: 1.0
    },
    noMusic: {
      master: 1.0,
      ui: 0.6,
      ambient: 0.0,
      feedback: 0.7,
      dialogue: 0.8
    },
    accessibility: {
      master: 1.0,
      ui: 0.8,
      ambient: 0.2,
      feedback: 1.0,
      dialogue: 1.0
    }
  },

  // =============================================================================
  // AUDIO CUE SEQUENCES
  // =============================================================================
  sequences: {
    gameStart: [
      { sound: "ui.click", delay: 0 },
      { sound: "feedback.notification", delay: 200 }
    ],
    achievementUnlock: [
      { sound: "feedback.unlock", delay: 0 },
      { sound: "feedback.achievement", delay: 300 }
    ],
    missionComplete: [
      { sound: "feedback.success", delay: 0 },
      { sound: "feedback.levelComplete", delay: 500 }
    ],
    consensusReached: [
      { sound: "welfare.relationshipImprove", delay: 0 },
      { sound: "welfare.consensusReached", delay: 400 }
    ],
    crisisResolved: [
      { sound: "connectivity.systemRepair", delay: 0 },
      { sound: "connectivity.resilienceAchieved", delay: 300 }
    ],
    unicornCreation: [
      { sound: "ecosystem.companyGrowth", delay: 0 },
      { sound: "ecosystem.innovationBoost", delay: 200 },
      { sound: "ecosystem.unicornCreated", delay: 600 }
    ]
  },

  // =============================================================================
  // DYNAMIC AUDIO RULES
  // =============================================================================
  dynamicRules: {
    // Connectivity game crisis intensity
    connectivityCrisis: {
      trigger: "crisisIntensity",
      thresholds: [
        { value: 0, volume: 0.3, pitch: 1.0 },
        { value: 30, volume: 0.5, pitch: 1.05 },
        { value: 60, volume: 0.7, pitch: 1.1 },
        { value: 80, volume: 0.9, pitch: 1.15 }
      ]
    },
    
    // Welfare game emotion states
    welfareEmotions: {
      trigger: "averageEmotionScore",
      thresholds: [
        { value: 0, filter: "lowpass", frequency: 500 },
        { value: 50, filter: "none" },
        { value: 80, filter: "highshelf", frequency: 2000, gain: 2 }
      ]
    },
    
    // Time pressure
    timePressure: {
      trigger: "timeRemaining",
      thresholds: [
        { value: 60, playSound: "feedback.notification", interval: 30 },
        { value: 30, playSound: "connectivity.warningBeep", loop: true },
        { value: 10, increaseTempo: 1.2 }
      ]
    }
  },

  // =============================================================================
  // ACCESSIBILITY FEATURES
  // =============================================================================
  accessibility: {
    // Audio descriptions for screen readers
    descriptions: {
      "ui.click": "Button clicked",
      "feedback.success": "Success sound",
      "feedback.error": "Error sound",
      "feedback.achievement": "Achievement unlocked",
      "ambient.mainMenu": "Calm background music"
    },
    
    // Visual cues for audio events
    visualCues: {
      enabled: false,
      duration: 300,
      colors: {
        success: "#2E7D32",
        error: "#C62828",
        notification: "#0288D1",
        achievement: "#FFD700"
      }
    },
    
    // Subtitles for dialogue
    subtitles: {
      enabled: true,
      fontSize: "1.2rem",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      textColor: "#FFFFFF"
    }
  }
};

// =============================================================================
// AUDIO MANAGER CLASS
// =============================================================================

export class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.currentAmbient = null;
    this.volumes = { ...audioConfig.presets.default };
    this.muted = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      // Initialize audio context
      this.context = new (window.AudioContext || window.webkitAudioContext)(
        audioConfig.engine.context
      );
      
      // Setup master gain
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = this.volumes.master;
      
      // Setup category gains
      this.categoryGains = {};
      for (const [key, category] of Object.entries(audioConfig.categories)) {
        const gain = this.context.createGain();
        gain.connect(this.masterGain);
        gain.gain.value = this.volumes[key] || category.defaultVolume;
        this.categoryGains[key] = gain;
      }
      
      // Preload essential sounds
      await this.preloadSounds();
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async preloadSounds() {
    const toPreload = [];
    
    // Collect sounds marked for preload
    const collectSounds = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (value && typeof value === 'object') {
          if (value.file && value.preload) {
            toPreload.push({ id: fullPath, config: value });
          } else if (!value.file) {
            collectSounds(value, fullPath);
          }
        }
      }
    };
    
    collectSounds(audioConfig.sounds);
    
    // Load in batches
    const batchSize = audioConfig.engine.preload.batchSize;
    for (let i = 0; i < toPreload.length; i += batchSize) {
      const batch = toPreload.slice(i, i + batchSize);
      await Promise.all(batch.map(({ id, config }) => 
        this.loadSound(id, config)
      ));
    }
  }

  async loadSound(id, config) {
    try {
      const response = await fetch(config.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      this.sounds.set(id, {
        buffer: audioBuffer,
        config: config
      });
    } catch (error) {
      console.error(`Failed to load sound ${id}:`, error);
    }
  }

  play(soundId, options = {}) {
    if (this.muted || !this.initialized) return;
    
    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`Sound not loaded: ${soundId}`);
      return;
    }
    
    const source = this.context.createBufferSource();
    source.buffer = sound.buffer;
    
    // Apply volume
    const gain = this.context.createGain();
    const baseVolume = sound.config.volume || 1.0;
    const categoryVolume = this.volumes[sound.config.category] || 1.0;
    gain.gain.value = baseVolume * categoryVolume * (options.volume || 1.0);
    
    // Connect nodes
    source.connect(gain);
    const categoryGain = this.categoryGains[sound.config.category] || this.masterGain;
    gain.connect(categoryGain);
    
    // Apply options
    if (options.loop !== undefined) source.loop = options.loop;
    else if (sound.config.loop) source.loop = true;
    
    // Start playback
    source.start(this.context.currentTime + (options.delay || 0) / 1000);
    
    return source;
  }

  playSequence(sequenceName) {
    const sequence = audioConfig.sequences[sequenceName];
    if (!sequence) return;
    
    sequence.forEach(({ sound, delay }) => {
      this.play(sound, { delay });
    });
  }

  setVolume(category, volume) {
    this.volumes[category] = Math.max(0, Math.min(1, volume));
    
    if (category === 'master' && this.masterGain) {
      this.masterGain.gain.value = this.volumes.master;
    } else if (this.categoryGains[category]) {
      this.categoryGains[category].gain.value = this.volumes[category];
    }
  }

  mute() {
    this.muted = true;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }

  unmute() {
    this.muted = false;
    if (this.masterGain) {
      this.masterGain.gain.value = this.volumes.master;
    }
  }
}

// Create singleton instance
export const audioManager = new AudioManager();

export default audioConfig;