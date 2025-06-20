/**
 * Mock Data - Framtidsbygget
 * 
 * Mock data för utveckling och testing av Framtidsbygget
 * Täcker alla utvecklingsscenarier och edge cases
 */

// =============================================================================
// MOCK GAME STATE DATA
// =============================================================================

export const mockGameState = {
  // Standard new player state
  newPlayer: {
    userId: "dev-user-new",
    totalFLScore: 0,
    onboardingStatus: "not_started",
    completedWorlds: [],
    unlockedAchievements: [],
    unlockedSynergies: {
      synergy_expert_data_model: false,
      synergy_empathy_training: false,
      synergy_skilled_workforce: false,
      synergy_resilient_network: false
    },
    compassProgress: {},
    lastUpdated: "2024-01-01T00:00:00.000Z",
    gameVersion: "1.0.0",
    sessionCount: 1,
    analyticsOptIn: false,
    createdAt: "2024-01-01T00:00:00.000Z"
  },

  // Player in middle of onboarding
  onboardingPlayer: {
    userId: "dev-user-onboarding",
    totalFLScore: 0,
    onboardingStatus: "step_3",
    completedWorlds: [],
    unlockedAchievements: [],
    unlockedSynergies: {
      synergy_expert_data_model: false,
      synergy_empathy_training: false,
      synergy_skilled_workforce: false,
      synergy_resilient_network: false
    },
    compassProgress: {
      "digital_transformation": "unlocked"
    },
    lastUpdated: "2024-01-01T00:30:00.000Z",
    gameVersion: "1.0.0",
    sessionCount: 1,
    analyticsOptIn: false,
    createdAt: "2024-01-01T00:00:00.000Z"
  },

  // Player with some progress
  progressingPlayer: {
    userId: "dev-user-progressing",
    totalFLScore: 2500,
    onboardingStatus: "completed",
    completedWorlds: [
      {
        worldId: "pussel-spel-datasystem",
        status: "completed",
        scoreAwarded: 1200,
        bestOutcome: "Perfekt säkerhet och effektivitet",
        completedAt: "2024-01-01T01:00:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "valfards-dilemma",
        status: "completed",
        scoreAwarded: 800,
        bestOutcome: "Den Pragmatiska Kompromissen",
        completedAt: "2024-01-01T01:30:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "kompetensresan",
        status: "completed",
        scoreAwarded: 500,
        bestOutcome: "Delvis Framgång",
        completedAt: "2024-01-01T02:00:00.000Z",
        gameVersion: "1.0.0"
      }
    ],
    unlockedAchievements: ["first_victory", "security_expert", "consensus_builder"],
    unlockedSynergies: {
      synergy_expert_data_model: true,
      synergy_empathy_training: false,
      synergy_skilled_workforce: true,
      synergy_resilient_network: false
    },
    compassProgress: {
      "digital_transformation": "mastered",
      "digital_forvaltning": "mastered",
      "ena_infrastruktur": "mastered",
      "sakerhet_integritet": "mastered",
      "digital_kompetens": "mastered",
      "baskompetens": "unlocked",
      "breddkompetens": "unlocked",
      "spetskompetens": "unlocked",
      "digital_naringslivs": "unlocked",
      "digital_infrastruktur": "locked",
      "cybersecurity_resilience": "locked"
    },
    lastUpdated: "2024-01-01T02:00:00.000Z",
    gameVersion: "1.0.0",
    sessionCount: 3,
    analyticsOptIn: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },

  // Advanced player (almost finished)
  advancedPlayer: {
    userId: "dev-user-advanced",
    totalFLScore: 5200,
    onboardingStatus: "completed",
    completedWorlds: [
      {
        worldId: "pussel-spel-datasystem",
        status: "completed",
        scoreAwarded: 1400,
        bestOutcome: "Perfekt lösning",
        completedAt: "2024-01-01T01:00:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "valfards-dilemma",
        status: "completed",
        scoreAwarded: 1000,
        bestOutcome: "Konsensuslösningen",
        completedAt: "2024-01-01T01:30:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "kompetensresan",
        status: "completed",
        scoreAwarded: 900,
        bestOutcome: "Stark kompetensbas",
        completedAt: "2024-01-01T02:00:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "konnektivitetsvakten",
        status: "completed",
        scoreAwarded: 1100,
        bestOutcome: "Resilient infrastruktur",
        completedAt: "2024-01-01T02:30:00.000Z",
        gameVersion: "1.0.0"
      }
    ],
    unlockedAchievements: [
      "first_victory", "security_expert", "consensus_builder", 
      "competence_master", "infrastructure_guardian", "high_scorer"
    ],
    unlockedSynergies: {
      synergy_expert_data_model: true,
      synergy_empathy_training: true,
      synergy_skilled_workforce: true,
      synergy_resilient_network: true
    },
    compassProgress: {
      "digital_transformation": "mastered",
      "digital_forvaltning": "mastered",
      "ena_infrastruktur": "mastered",
      "sakerhet_integritet": "mastered",
      "anvandbarhet_tillganglighet": "mastered",
      "digital_kompetens": "mastered",
      "baskompetens": "mastered",
      "breddkompetens": "mastered",
      "spetskompetens": "mastered",
      "digital_naringslivs": "unlocked",
      "digital_infrastruktur": "mastered",
      "bredband_5g": "mastered",
      "edge_computing": "mastered",
      "cybersecurity_resilience": "mastered",
      "nationell_cybersakerhet": "mastered",
      "incident_response": "mastered"
    },
    lastUpdated: "2024-01-01T02:30:00.000Z",
    gameVersion: "1.0.0",
    sessionCount: 8,
    analyticsOptIn: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },

  // Perfect player (all games completed)
  perfectPlayer: {
    userId: "dev-user-perfect",
    totalFLScore: 6800,
    onboardingStatus: "completed",
    completedWorlds: [
      {
        worldId: "pussel-spel-datasystem",
        status: "completed",
        scoreAwarded: 1500,
        bestOutcome: "Perfekt lösning",
        completedAt: "2024-01-01T01:00:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "valfards-dilemma",
        status: "completed",
        scoreAwarded: 1000,
        bestOutcome: "Konsensuslösningen",
        completedAt: "2024-01-01T01:30:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "kompetensresan",
        status: "completed",
        scoreAwarded: 1200,
        bestOutcome: "Branschledande digital kompetens",
        completedAt: "2024-01-01T02:00:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "konnektivitetsvakten",
        status: "completed",
        scoreAwarded: 1300,
        bestOutcome: "Perfekt krishantering",
        completedAt: "2024-01-01T02:30:00.000Z",
        gameVersion: "1.0.0"
      },
      {
        worldId: "ekosystembyggaren",
        status: "completed",
        scoreAwarded: 1800,
        bestOutcome: "Global digital supermakt",
        completedAt: "2024-01-01T03:00:00.000Z",
        gameVersion: "1.0.0"
      }
    ],
    unlockedAchievements: [
      "first_victory", "security_expert", "consensus_builder", 
      "competence_master", "infrastructure_guardian", "ecosystem_architect",
      "high_scorer", "perfect_strategist", "synergy_master", "digital_visionary"
    ],
    unlockedSynergies: {
      synergy_expert_data_model: true,
      synergy_empathy_training: true,
      synergy_skilled_workforce: true,
      synergy_resilient_network: true
    },
    compassProgress: {
      "digital_transformation": "mastered",
      "digital_forvaltning": "mastered",
      "ena_infrastruktur": "mastered",
      "sakerhet_integritet": "mastered",
      "anvandbarhet_tillganglighet": "mastered",
      "digital_kompetens": "mastered",
      "baskompetens": "mastered",
      "breddkompetens": "mastered",
      "spetskompetens": "mastered",
      "digital_naringslivs": "mastered",
      "innovation_ekosystem": "mastered",
      "digital_handelsmiljo": "mastered",
      "hallbar_digitalisering": "mastered",
      "digital_infrastruktur": "mastered",
      "bredband_5g": "mastered",
      "edge_computing": "mastered",
      "digital_tvillingar": "mastered",
      "cybersecurity_resilience": "mastered",
      "nationell_cybersakerhet": "mastered",
      "incident_response": "mastered",
      "resilient_systems": "mastered"
    },
    lastUpdated: "2024-01-01T03:00:00.000Z",
    gameVersion: "1.0.0",
    sessionCount: 12,
    analyticsOptIn: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
};

// =============================================================================
// MOCK FIREBASE RESPONSES
// =============================================================================

export const mockFirebaseResponses = {
  // Authentication responses
  auth: {
    signInAnonymously: {
      user: {
        uid: "mock-user-123",
        isAnonymous: true,
        metadata: {
          creationTime: "2024-01-01T00:00:00.000Z",
          lastSignInTime: "2024-01-01T00:00:00.000Z"
        }
      }
    },
    
    authStateChanged: {
      authenticated: {
        uid: "mock-user-123",
        isAnonymous: true
      },
      unauthenticated: null
    }
  },

  // Firestore responses
  firestore: {
    playerData: {
      exists: true,
      data: mockGameState.progressingPlayer
    },
    
    playerDataNotExists: {
      exists: false,
      data: null
    },
    
    saveSuccess: {
      success: true,
      timestamp: "2024-01-01T12:00:00.000Z"
    },
    
    saveFailure: {
      success: false,
      error: "Network error: Unable to reach Firestore"
    }
  },

  // Analytics responses
  analytics: {
    logEventSuccess: {
      success: true,
      eventId: "analytics_event_123"
    },
    
    logEventFailure: {
      success: false,
      error: "Analytics not available"
    }
  }
};

// =============================================================================
// MOCK GAME RESULTS
// =============================================================================

export const mockGameResults = {
  // Puzzle Game Results
  puzzleGame: {
    perfectScore: {
      success: true,
      budgetSpent: 20,
      movesMade: 8,
      timeSpent: 180,
      modernizationsCompleted: ["forsakringskassan", "lantmateriet"],
      securityScore: 100,
      efficiencyScore: 95
    },
    
    goodScore: {
      success: true,
      budgetSpent: 40,
      movesMade: 12,
      timeSpent: 300,
      modernizationsCompleted: ["forsakringskassan"],
      securityScore: 85,
      efficiencyScore: 75
    },
    
    poorScore: {
      success: false,
      budgetSpent: 80,
      movesMade: 20,
      timeSpent: 600,
      modernizationsCompleted: [],
      securityScore: 45,
      efficiencyScore: 30
    }
  },

  // Welfare Game Results
  welfareGame: {
    consensus: {
      success: true,
      finalAutonomy: 85,
      finalSecurity: 80,
      finalStaffWellbeing: 90,
      outcome: "Konsensus",
      dialogueChoices: 12,
      relationshipScores: {
        arne: 90,
        karin: 85,
        lasse: 95
      }
    },
    
    compromise: {
      success: true,
      finalAutonomy: 70,
      finalSecurity: 75,
      finalStaffWellbeing: 65,
      outcome: "Kompromiss",
      dialogueChoices: 10,
      relationshipScores: {
        arne: 70,
        karin: 80,
        lasse: 60
      }
    },
    
    failure: {
      success: false,
      finalAutonomy: 30,
      finalSecurity: 40,
      finalStaffWellbeing: 25,
      outcome: "Implementeringsstopp",
      dialogueChoices: 8,
      relationshipScores: {
        arne: 20,
        karin: 30,
        lasse: 15
      }
    }
  },

  // Competence Game Results  
  competenceGame: {
    excellent: {
      success: true,
      finalCompetence: {
        base: 90,
        broad: 85,
        specialist: 80
      },
      finalBudget: 15,
      monthsCompleted: 12,
      eventsHandled: 4,
      trainingPrograms: 8
    },
    
    good: {
      success: true,
      finalCompetence: {
        base: 75,
        broad: 70,
        specialist: 60
      },
      finalBudget: 5,
      monthsCompleted: 12,
      eventsHandled: 3,
      trainingPrograms: 6
    },
    
    poor: {
      success: false,
      finalCompetence: {
        base: 45,
        broad: 40,
        specialist: 30
      },
      finalBudget: 0,
      monthsCompleted: 10,
      eventsHandled: 1,
      trainingPrograms: 3
    }
  },

  // Connectivity Game Results
  connectivityGame: {
    perfect: {
      success: true,
      finalIndex: 95,
      buildPhaseScore: 300,
      crisisesHandled: 5,
      infrastructureBuilt: 15,
      redundancyLevel: "high",
      responseTime: 45
    },
    
    good: {
      success: true,
      finalIndex: 80,
      buildPhaseScore: 200,
      crisisesHandled: 3,
      infrastructureBuilt: 12,
      redundancyLevel: "medium",
      responseTime: 90
    },
    
    poor: {
      success: false,
      finalIndex: 50,
      buildPhaseScore: 100,
      crisisesHandled: 1,
      infrastructureBuilt: 8,
      redundancyLevel: "low",
      responseTime: 180
    }
  },

  // Ecosystem Game Results
  ecosystemGame: {
    worldClass: {
      success: true,
      finalMetrics: {
        innovation: 90,
        competitiveness: 85,
        cybersecurity: 88,
        sustainability: 82
      },
      companiesCreated: {
        startups: 25,
        growth: 15,
        enterprise: 8,
        unicorns: 3
      },
      policiesImplemented: 12,
      quartersCompleted: 10
    },
    
    strong: {
      success: true,
      finalMetrics: {
        innovation: 75,
        competitiveness: 70,
        cybersecurity: 75,
        sustainability: 65
      },
      companiesCreated: {
        startups: 20,
        growth: 10,
        enterprise: 5,
        unicorns: 1
      },
      policiesImplemented: 8,
      quartersCompleted: 10
    },
    
    weak: {
      success: false,
      finalMetrics: {
        innovation: 50,
        competitiveness: 45,
        cybersecurity: 55,
        sustainability: 40
      },
      companiesCreated: {
        startups: 10,
        growth: 4,
        enterprise: 2,
        unicorns: 0
      },
      policiesImplemented: 4,
      quartersCompleted: 8
    }
  }
};

// =============================================================================
// MOCK ERROR SCENARIOS
// =============================================================================

export const mockErrors = {
  network: {
    code: "network/connection-failed",
    message: "Nätverksanslutningen misslyckades. Kontrollera din internetanslutning.",
    details: "Unable to connect to Firebase servers"
  },
  
  auth: {
    code: "auth/network-request-failed", 
    message: "Autentisering misslyckades. Försök igen senare.",
    details: "Authentication service temporarily unavailable"
  },
  
  firestore: {
    code: "firestore/unavailable",
    message: "Databas tillfälligt otillgänglig. Dina framsteg sparas lokalt.",
    details: "Firestore service temporarily unavailable"
  },
  
  permissions: {
    code: "firestore/permission-denied",
    message: "Åtkomst nekad. Kontrollera dina behörigheter.",
    details: "Insufficient permissions to access document"
  },
  
  quota: {
    code: "firestore/resource-exhausted",
    message: "Tjänsten är tillfälligt överbelastad. Försök igen om en stund.",
    details: "Firestore quota exceeded"
  }
};

// =============================================================================
// MOCK PERFORMANCE DATA
// =============================================================================

export const mockPerformanceMetrics = {
  firebase: {
    responseTime: {
      auth: 150, // ms
      loadPlayerData: 300,
      savePlayerData: 200,
      analytics: 100
    },
    
    bandwidth: {
      playerDataSize: 2.5, // KB
      analyticsEventSize: 0.8,
      totalSessionData: 15.2
    }
  },
  
  pixi: {
    fps: 60,
    memoryUsage: 45, // MB
    texturesLoaded: 8,
    spritesInScene: 25,
    drawCalls: 12
  },
  
  react: {
    renderTime: 16, // ms
    componentsUpdated: 5,
    stateUpdates: 3,
    effectsTriggered: 2
  }
};

// =============================================================================
// UTILITY FUNCTIONS FOR MOCKS
// =============================================================================

export const mockUtils = {
  // Get random game state for testing
  getRandomGameState() {
    const states = Object.keys(mockGameState);
    const randomState = states[Math.floor(Math.random() * states.length)];
    return mockGameState[randomState];
  },

  // Get random game result for testing
  getRandomGameResult(gameId) {
    if (!mockGameResults[gameId]) return null;
    
    const results = Object.keys(mockGameResults[gameId]);
    const randomResult = results[Math.floor(Math.random() * results.length)];
    return mockGameResults[gameId][randomResult];
  },

  // Simulate network delay
  async simulateNetworkDelay(min = 100, max = 500) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  },

  // Generate mock analytics event
  generateMockAnalyticsEvent(eventType, gameState = mockGameState.progressingPlayer) {
    return {
      eventType,
      sessionId: `mock_session_${Date.now()}`,
      userId: gameState.userId,
      timestamp: new Date().toISOString(),
      gameVersion: "1.0.0",
      eventData: {
        totalFLScore: gameState.totalFLScore,
        completedWorlds: gameState.completedWorlds.length,
        sessionCount: gameState.sessionCount,
        screenSize: "desktop"
      }
    };
  },

  // Create mock error with retry mechanism
  createMockError(errorType = "network", shouldRetry = true) {
    const error = { ...mockErrors[errorType] };
    error.retry = shouldRetry;
    error.timestamp = new Date().toISOString();
    return error;
  }
};

// =============================================================================
// DEVELOPMENT FLAGS
// =============================================================================

export const mockFlags = {
  // Enable different mock scenarios
  SIMULATE_NETWORK_DELAYS: true,
  SIMULATE_RANDOM_ERRORS: false,
  USE_MOCK_FIREBASE: false,
  ENABLE_PERFECT_SCORES: true,
  SKIP_ONBOARDING: false,
  UNLOCK_ALL_GAMES: false,
  ENABLE_DEBUG_CHEATS: true,
  
  // Performance testing
  MEASURE_PERFORMANCE: true,
  LOG_MOCK_CALLS: false,
  
  // Error simulation rates (0-1)
  NETWORK_ERROR_RATE: 0.05,
  AUTH_ERROR_RATE: 0.02,
  FIRESTORE_ERROR_RATE: 0.03
};

export default {
  mockGameState,
  mockFirebaseResponses,
  mockGameResults,
  mockErrors,
  mockPerformanceMetrics,
  mockUtils,
  mockFlags
};