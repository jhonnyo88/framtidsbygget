/**
 * Achievements Data - Framtidsbygget
 * 
 * Complete achievement system with unlocking conditions and rewards
 */

export const achievementsData = {
  // =============================================================================
  // ACHIEVEMENT CATEGORIES
  // =============================================================================
  categories: {
    gameplay: {
      id: "gameplay",
      name: "Spelframsteg",
      description: "Utmärkelser för att slutföra uppdrag och nå milstolpar",
      icon: "emoji_events",
      color: "#FFD700"
    },
    mastery: {
      id: "mastery",
      name: "Mästerskap",
      description: "Utmärkelser för exceptionella prestationer",
      icon: "workspace_premium",
      color: "#8E24AA"
    },
    strategy: {
      id: "strategy",
      name: "Strategisk Excellens",
      description: "Utmärkelser för smart planering och synergier",
      icon: "psychology",
      color: "#0288D1"
    },
    exploration: {
      id: "exploration",
      name: "Utforskning",
      description: "Utmärkelser för att upptäcka alla möjligheter",
      icon: "explore",
      color: "#2E7D32"
    },
    social: {
      id: "social",
      name: "Samverkan",
      description: "Utmärkelser för att bygga relationer och konsensus",
      icon: "groups",
      color: "#FF8F00"
    }
  },

  // =============================================================================
  // ACHIEVEMENT DEFINITIONS
  // =============================================================================
  achievements: [
    // Gameplay Achievements
    {
      id: "first_victory",
      name: "Första Segern",
      description: "Slutför ditt första uppdrag framgångsrikt",
      category: "gameplay",
      icon: "flag",
      rarity: "common",
      flScoreReward: 50,
      unlockConditions: {
        type: "game_completion",
        count: 1,
        anyGame: true
      },
      flavorText: "Varje resa börjar med ett första steg"
    },
    {
      id: "halfway_there",
      name: "Halvvägs Till Målet",
      description: "Slutför 3 av 5 uppdrag",
      category: "gameplay",
      icon: "trending_up",
      rarity: "uncommon",
      flScoreReward: 100,
      unlockConditions: {
        type: "game_completion",
        count: 3,
        anyGame: true
      },
      flavorText: "Framstegen syns tydligt på kartan"
    },
    {
      id: "digital_strategist",
      name: "Digital Strateg",
      description: "Slutför alla fem uppdrag",
      category: "gameplay",
      icon: "military_tech",
      rarity: "rare",
      flScoreReward: 200,
      unlockConditions: {
        type: "game_completion",
        count: 5,
        allGames: true
      },
      flavorText: "Du har bevisat din förmåga som digital ledare"
    },

    // Mastery Achievements
    {
      id: "security_expert",
      name: "Säkerhetsexpert",
      description: "Uppnå perfekt säkerhet i Säker Datasystem",
      category: "mastery",
      icon: "gpp_good",
      rarity: "rare",
      flScoreReward: 150,
      unlockConditions: {
        type: "specific_outcome",
        gameId: "pussel-spel-datasystem",
        requirement: "perfect_security",
        minScore: 1400
      },
      flavorText: "Ingen databreach på din vakt"
    },
    {
      id: "consensus_builder",
      name: "Konsensusbyggare",
      description: "Nå full konsensus i Välfärdens Dilemma",
      category: "mastery",
      icon: "handshake",
      rarity: "epic",
      flScoreReward: 200,
      unlockConditions: {
        type: "specific_outcome",
        gameId: "valfards-dilemma",
        requirement: "consensus_outcome",
        outcome: "Konsensus"
      },
      flavorText: "Alla parter lämnade mötet nöjda"
    },
    {
      id: "competence_master",
      name: "Kompetensmästare",
      description: "Maximal kompetens i alla tre områden",
      category: "mastery",
      icon: "school",
      rarity: "epic",
      flScoreReward: 180,
      unlockConditions: {
        type: "metric_threshold",
        gameId: "kompetensresan",
        metrics: {
          base: 90,
          broad: 85,
          specialist: 80
        }
      },
      flavorText: "Organisationen är redo för framtiden"
    },
    {
      id: "crisis_commander",
      name: "Kriskommendör",
      description: "Hantera alla kriser utan förluster",
      category: "mastery",
      icon: "emergency",
      rarity: "epic",
      flScoreReward: 200,
      unlockConditions: {
        type: "metric_threshold",
        gameId: "konnektivitetsvakten",
        requirement: "perfect_crisis_management",
        finalIndex: 95
      },
      flavorText: "Lugn under storm, stark i krisen"
    },
    {
      id: "unicorn_creator",
      name: "Enhörningsskapare",
      description: "Skapa 3 enhörningsföretag",
      category: "mastery",
      icon: "auto_awesome",
      rarity: "legendary",
      flScoreReward: 300,
      unlockConditions: {
        type: "specific_outcome",
        gameId: "ekosystembyggaren",
        requirement: "unicorns_created",
        count: 3
      },
      flavorText: "Sveriges digitala framtid är säkrad"
    },

    // Strategy Achievements
    {
      id: "synergy_apprentice",
      name: "Synergistudent",
      description: "Lås upp din första synergi",
      category: "strategy",
      icon: "link",
      rarity: "common",
      flScoreReward: 75,
      unlockConditions: {
        type: "synergy_unlock",
        count: 1,
        anySynergy: true
      },
      flavorText: "Systemen börjar samverka"
    },
    {
      id: "synergy_master",
      name: "Synergimästare",
      description: "Lås upp alla fyra synergier",
      category: "strategy",
      icon: "hub",
      rarity: "legendary",
      flScoreReward: 250,
      unlockConditions: {
        type: "synergy_unlock",
        count: 4,
        allSynergies: true
      },
      flavorText: "Perfekt harmonisk samverkan uppnådd"
    },
    {
      id: "efficiency_expert",
      name: "Effektivitetsexpert",
      description: "Slutför ett uppdrag med minimal resursanvändning",
      category: "strategy",
      icon: "speed",
      rarity: "rare",
      flScoreReward: 120,
      unlockConditions: {
        type: "efficiency_metric",
        anyGame: true,
        maxBudgetUsed: 0.3,
        maxTimeUsed: 0.5
      },
      flavorText: "Maximal nytta med minimal insats"
    },
    {
      id: "perfect_planner",
      name: "Perfekt Planerare",
      description: "Slutför Kompetensresan utan negativa händelser",
      category: "strategy",
      icon: "event_available",
      rarity: "epic",
      flScoreReward: 180,
      unlockConditions: {
        type: "specific_gameplay",
        gameId: "kompetensresan",
        requirement: "no_negative_events"
      },
      flavorText: "Förberedelse är nyckeln till framgång"
    },

    // Exploration Achievements
    {
      id: "compass_navigator",
      name: "Kompassnavigatör",
      description: "Utforska 50% av Digitala Kompassen",
      category: "exploration",
      icon: "explore",
      rarity: "uncommon",
      flScoreReward: 80,
      unlockConditions: {
        type: "compass_exploration",
        percentageUnlocked: 50
      },
      flavorText: "Strategins djup börjar visa sig"
    },
    {
      id: "knowledge_seeker",
      name: "Kunskapssökare",
      description: "Lås upp alla kompassnoder",
      category: "exploration",
      icon: "psychology",
      rarity: "legendary",
      flScoreReward: 300,
      unlockConditions: {
        type: "compass_exploration",
        percentageUnlocked: 100
      },
      flavorText: "Ingen kunskap är för liten att värdesätta"
    },
    {
      id: "alternative_paths",
      name: "Alternativa Vägar",
      description: "Slutför samma uppdrag med olika strategier",
      category: "exploration",
      icon: "alt_route",
      rarity: "rare",
      flScoreReward: 150,
      unlockConditions: {
        type: "replay_variation",
        anyGame: true,
        differentOutcomes: 2
      },
      flavorText: "Det finns alltid mer än en lösning"
    },

    // Social Achievements
    {
      id: "empathy_champion",
      name: "Empatimästare",
      description: "Håll alla karaktärer nöjda i Välfärdens Dilemma",
      category: "social",
      icon: "volunteer_activism",
      rarity: "epic",
      flScoreReward: 200,
      unlockConditions: {
        type: "relationship_scores",
        gameId: "valfards-dilemma",
        allCharactersAbove: 80
      },
      flavorText: "Att lyssna är att leda"
    },
    {
      id: "network_builder",
      name: "Nätverksbyggare",
      description: "Anslut alla regioner i Konnektivitetsvakten",
      category: "social",
      icon: "share",
      rarity: "rare",
      flScoreReward: 120,
      unlockConditions: {
        type: "connectivity_metric",
        gameId: "konnektivitetsvakten",
        allRegionsConnected: true
      },
      flavorText: "Tillsammans är vi starkare"
    },
    {
      id: "innovation_catalyst",
      name: "Innovationskatalysator",
      description: "Främja samarbete mellan alla sektorer",
      category: "social",
      icon: "diversity_3",
      rarity: "epic",
      flScoreReward: 180,
      unlockConditions: {
        type: "ecosystem_metric",
        gameId: "ekosystembyggaren",
        crossSectorPartnerships: 10
      },
      flavorText: "Innovation föds i mötet mellan olikheter"
    },

    // Hidden/Secret Achievements
    {
      id: "speedrunner",
      name: "Blixtsnabb Strateg",
      description: "Slutför alla uppdrag på under 2 timmar",
      category: "mastery",
      icon: "bolt",
      rarity: "legendary",
      flScoreReward: 500,
      hidden: true,
      unlockConditions: {
        type: "speedrun",
        totalTime: 7200, // 2 hours in seconds
        allGames: true
      },
      flavorText: "Snabba beslut, perfekt exekvering"
    },
    {
      id: "perfectionist",
      name: "Perfektionist",
      description: "Uppnå maximal poäng i alla uppdrag",
      category: "mastery",
      icon: "stars",
      rarity: "legendary",
      flScoreReward: 1000,
      hidden: true,
      unlockConditions: {
        type: "perfect_scores",
        allGames: true
      },
      flavorText: "Inget mindre än perfektion duger"
    },
    {
      id: "easter_egg_hunter",
      name: "Påskäggsjägare",
      description: "Hitta det hemliga påskägget",
      category: "exploration",
      icon: "egg",
      rarity: "legendary",
      flScoreReward: 200,
      hidden: true,
      unlockConditions: {
        type: "easter_egg",
        found: true
      },
      flavorText: "Nyfikenhet belönas alltid"
    }
  ],

  // =============================================================================
  // ACHIEVEMENT FUNCTIONS
  // =============================================================================
  
  /**
   * Check if achievement should be unlocked based on game state
   */
  checkAchievement(achievementId, gameState, gameResult = null) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return false;
    
    // Already unlocked
    if (gameState.unlockedAchievements.includes(achievementId)) {
      return false;
    }
    
    const conditions = achievement.unlockConditions;
    
    switch (conditions.type) {
      case "game_completion":
        return this.checkGameCompletionCondition(conditions, gameState);
        
      case "specific_outcome":
        return this.checkSpecificOutcomeCondition(conditions, gameState, gameResult);
        
      case "metric_threshold":
        return this.checkMetricThresholdCondition(conditions, gameResult);
        
      case "synergy_unlock":
        return this.checkSynergyCondition(conditions, gameState);
        
      case "compass_exploration":
        return this.checkCompassCondition(conditions, gameState);
        
      case "relationship_scores":
        return this.checkRelationshipCondition(conditions, gameResult);
        
      default:
        return false;
    }
  },
  
  checkGameCompletionCondition(conditions, gameState) {
    const completedCount = gameState.completedWorlds.length;
    
    if (conditions.anyGame) {
      return completedCount >= conditions.count;
    }
    
    if (conditions.allGames) {
      return completedCount === 5;
    }
    
    return false;
  },
  
  checkSpecificOutcomeCondition(conditions, gameState, gameResult) {
    if (!gameResult || gameResult.worldId !== conditions.gameId) {
      return false;
    }
    
    if (conditions.requirement === "perfect_security") {
      return gameResult.securityScore === 100 && gameResult.scoreAwarded >= conditions.minScore;
    }
    
    if (conditions.requirement === "consensus_outcome") {
      return gameResult.outcome === conditions.outcome;
    }
    
    if (conditions.requirement === "unicorns_created") {
      return gameResult.companiesCreated?.unicorns >= conditions.count;
    }
    
    return false;
  },
  
  checkMetricThresholdCondition(conditions, gameResult) {
    if (!gameResult || gameResult.worldId !== conditions.gameId) {
      return false;
    }
    
    if (conditions.metrics) {
      return Object.keys(conditions.metrics).every(key => 
        gameResult.finalCompetence?.[key] >= conditions.metrics[key]
      );
    }
    
    if (conditions.finalIndex) {
      return gameResult.finalIndex >= conditions.finalIndex;
    }
    
    return false;
  },
  
  checkSynergyCondition(conditions, gameState) {
    const unlockedSynergies = Object.values(gameState.unlockedSynergies)
      .filter(unlocked => unlocked).length;
    
    if (conditions.anySynergy) {
      return unlockedSynergies >= conditions.count;
    }
    
    if (conditions.allSynergies) {
      return unlockedSynergies === 4;
    }
    
    return false;
  },
  
  checkCompassCondition(conditions, gameState) {
    const totalNodes = Object.keys(gameState.compassProgress).length;
    const unlockedNodes = Object.values(gameState.compassProgress)
      .filter(status => status !== "locked").length;
    
    const percentage = (unlockedNodes / totalNodes) * 100;
    return percentage >= conditions.percentageUnlocked;
  },
  
  checkRelationshipCondition(conditions, gameResult) {
    if (!gameResult || gameResult.worldId !== conditions.gameId) {
      return false;
    }
    
    if (conditions.allCharactersAbove && gameResult.relationshipScores) {
      return Object.values(gameResult.relationshipScores).every(score => 
        score >= conditions.allCharactersAbove
      );
    }
    
    return false;
  },
  
  /**
   * Get all achievements that should be checked after a game completion
   */
  getAchievementsToCheck(gameId) {
    return this.achievements.filter(achievement => {
      const conditions = achievement.unlockConditions;
      
      // General achievements that can be earned from any game
      if (conditions.anyGame) return true;
      
      // Game-specific achievements
      if (conditions.gameId === gameId) return true;
      
      // Achievements that check all games
      if (conditions.allGames) return true;
      
      // Synergy and compass achievements
      if (["synergy_unlock", "compass_exploration"].includes(conditions.type)) return true;
      
      return false;
    });
  },
  
  /**
   * Calculate total FL score from achievements
   */
  calculateAchievementScore(unlockedAchievements) {
    return unlockedAchievements.reduce((total, achievementId) => {
      const achievement = this.achievements.find(a => a.id === achievementId);
      return total + (achievement?.flScoreReward || 0);
    }, 0);
  }
};

// =============================================================================
// ACHIEVEMENT DISPLAY HELPERS
// =============================================================================

export const achievementHelpers = {
  getRarityColor(rarity) {
    const colors = {
      common: "#9E9E9E",
      uncommon: "#4CAF50",
      rare: "#2196F3",
      epic: "#9C27B0",
      legendary: "#FF9800"
    };
    return colors[rarity] || colors.common;
  },
  
  getRarityName(rarity) {
    const names = {
      common: "Vanlig",
      uncommon: "Ovanlig",
      rare: "Sällsynt",
      epic: "Episk",
      legendary: "Legendarisk"
    };
    return names[rarity] || names.common;
  },
  
  formatAchievementProgress(achievement, gameState) {
    const conditions = achievement.unlockConditions;
    
    switch (conditions.type) {
      case "game_completion":
        const completed = gameState.completedWorlds.length;
        return `${completed} / ${conditions.count} uppdrag slutförda`;
        
      case "synergy_unlock":
        const synergies = Object.values(gameState.unlockedSynergies)
          .filter(unlocked => unlocked).length;
        return `${synergies} / ${conditions.count} synergier upplåsta`;
        
      case "compass_exploration":
        const totalNodes = 25; // Approximate total nodes
        const unlockedNodes = Object.values(gameState.compassProgress)
          .filter(status => status !== "locked").length;
        const percentage = Math.floor((unlockedNodes / totalNodes) * 100);
        return `${percentage}% av kompassen utforskad`;
        
      default:
        return achievement.hidden ? "???" : "Framsteg dolt";
    }
  }
};

export default achievementsData;