/**
 * Game Content Data - Framtidsbygget
 * 
 * Strukturerad spelcontent för alla minispel i Framtidsbygget
 * Följer specifikationerna från Master GDD och UX design system
 */

export const gameContent = {
  // =============================================================================
  // PUZZLE GAME: Säker Datasystem
  // =============================================================================
  puzzleGame: {
    metadata: {
      id: "pussel-spel-datasystem",
      title: "Säker Datasystem",
      description: "Bygg en säker och sammanhållen digital infrastruktur",
      estimatedTime: "10-15 minuter",
      difficulty: "Medium"
    },
    
    gameElements: {
      playerOrganization: {
        id: "fms",
        name: "Myndigheten för Samhällsutveckling (FMS)",
        description: "Din organisation som behöver sammanhållen datahantering"
      },
      
      dataSources: [
        {
          id: "skatteverket",
          name: "Skatteverket",
          type: "source",
          dataType: "person",
          isLegacy: false,
          description: "Moderna personuppgifter och skattedata",
          position: { x: 50, y: 100 },
          icon: "receipt_long",
          modernizationCost: 0
        },
        {
          id: "bolagsverket", 
          name: "Bolagsverket",
          type: "source",
          dataType: "organisation",
          isLegacy: false,
          description: "Uppdaterade företags- och organisationsdata",
          position: { x: 50, y: 200 },
          icon: "business",
          modernizationCost: 0
        },
        {
          id: "forsakringskassan",
          name: "Försäkringskassan",
          type: "source", 
          dataType: "person",
          isLegacy: true,
          description: "Föråldrat system som kräver modernisering",
          position: { x: 50, y: 300 },
          icon: "health_and_safety",
          modernizationCost: 50
        },
        {
          id: "lantmateriet",
          name: "Lantmäteriet",
          type: "source",
          dataType: "fastighet",
          isLegacy: true,
          description: "Gammalt fastighetssystem behöver uppdateras",
          position: { x: 50, y: 400 },
          icon: "landscape",
          modernizationCost: 30
        }
      ],
      
      enaHub: {
        id: "ena_hub",
        name: "Ena-hubben",
        type: "hub",
        description: "Central säker datadelningsplattform",
        position: { x: 300, y: 250 },
        icon: "hub",
        securityLevel: "high"
      },
      
      internalSystems: [
        {
          id: "tillstandsenheten",
          name: "Tillståndsenheten",
          type: "internal",
          dataNeeds: ["person", "organisation"],
          description: "Hanterar tillstånd och licenser",
          position: { x: 550, y: 150 },
          icon: "verified",
          requiredConnections: ["skatteverket", "bolagsverket"]
        },
        {
          id: "analysavdelningen",
          name: "Analysavdelningen", 
          type: "internal",
          dataNeeds: ["person", "organisation", "fastighet"],
          description: "Strategisk analys och rapportering",
          position: { x: 550, y: 250 },
          icon: "analytics",
          requiredConnections: ["skatteverket", "bolagsverket", "lantmateriet"]
        },
        {
          id: "medborgarservice",
          name: "Medborgarservice",
          type: "internal", 
          dataNeeds: ["person"],
          description: "Direktkontakt med medborgare",
          position: { x: 550, y: 350 },
          icon: "support_agent",
          requiredConnections: ["skatteverket", "forsakringskassan"]
        }
      ]
    },
    
    gameConfig: {
      initialBudget: 100,
      modernizationCosts: {
        "forsakringskassan": 50,
        "lantmateriet": 30
      },
      connectionCosts: {
        "source_to_hub": 0,
        "hub_to_internal": 0,
        "direct_connection": 25
      },
      movePenalty: 1,
      timeBonusThreshold: 300 // 5 minutes in seconds
    },
    
    winConditions: {
      primary: {
        description: "Alla interna system måste vara anslutna via Ena-hubben",
        requirement: "all_systems_connected_via_hub"
      },
      optimal: {
        description: "Säkerhet prioriterat över direktanslutningar",
        requirement: "no_direct_connections_used",
        bonus: 200
      },
      efficiency: {
        description: "Genomfört under tidsgräns",
        requirement: "completed_under_time_limit",
        bonus: 100
      }
    },
    
    ui: {
      instructions: "Dra anslutningar från källorna, via Ena-hubben, till de interna systemen som behöver data.",
      budgetLabel: "Budget:",
      movesLabel: "Antal kopplingar:",
      timeLabel: "Tid:",
      modernizationModal: {
        title: "Modernisering krävs",
        template: "Detta system ('{systemName}') är föråldrat och måste standardiseras innan det kan anslutas till Ena-infrastrukturen. Moderniseringen kommer att göra systemet säkrare och mer kompatibelt.",
        costLabel: "Kostnad: {cost} budgetenheter",
        buttons: {
          cancel: "Avbryt",
          approve: "Godkänn investering"
        }
      },
      insufficientFundsModal: {
        title: "Otillräcklig budget", 
        text: "Du har inte tillräckligt med budget för att genomföra denna modernisering. Överväg andra lösningar eller optimera dina resurser.",
        button: "Förstått"
      }
    },
    
    feedback: {
      success: {
        title: "Uppdraget slutfört!",
        description: "Du har framgångsrikt byggt en säker och sammanhållen digital infrastruktur.",
        template: "Medborgarnöjdhet: +{citizenSatisfaction} poäng\nSäkerhet: +{security} poäng\nEffektivitet: +{efficiency} poäng\nTotal poäng: {totalScore}",
        quote: "Genom att bygga en säker och sammanhållen infrastruktur har du lagt grunden för en smartare förvaltning. Bra jobbat, strateg!"
      },
      failure: {
        title: "Uppdraget kräver mer arbete",
        description: "Systemarkitekturen är inte tillräckligt säker eller komplett.",
        suggestions: [
          "Säkerställ att alla system är anslutna via Ena-hubben",
          "Modernisera föråldrade system innan anslutning",
          "Undvik direktanslutningar för bättre säkerhet"
        ]
      }
    }
  },

  // =============================================================================
  // WELFARE GAME: Välfärdens Dilemma
  // =============================================================================
  welfareGame: {
    metadata: {
      id: "valfards-dilemma",
      title: "Välfärdens Dilemma",
      description: "Navigera etiska val i digitalisering av välfärdstjänster",
      estimatedTime: "15-20 minuter",
      difficulty: "Hard"
    },
    
    characters: {
      player: {
        id: "player",
        name: "Digital Strateg",
        role: "Mötesordförande",
        description: "Du leder mötet och fattar de avgörande besluten"
      },
      arne: {
        id: "arne",
        name: "Arne",
        age: 82,
        role: "Omsorgstagare",
        personality: "Självständig, skeptisk till övervakning, värderar integritet",
        description: "En självständig 82-åring som värdesätter sin autonomi och integritet",
        avatar: "elderly",
        emotionalStates: {
          neutral: { color: "#5A5A5A", description: "Lugn och avvaktande" },
          concerned: { color: "#ED6C02", description: "Orolig för sin integritet" },
          upset: { color: "#C62828", description: "Upprörd över övervakningsförslag" },
          satisfied: { color: "#2E7D32", description: "Nöjd med beslut som respekterar hans autonomi" }
        }
      },
      karin: {
        id: "karin", 
        name: "Karin",
        role: "Anhörig",
        relationship: "Arnes dotter",
        personality: "Orolig, vill ha maximal säkerhet, känslomässigt engagerad",
        description: "Arnes dotter som är mycket orolig för sin pappas säkerhet",
        avatar: "family_restroom",
        emotionalStates: {
          neutral: { color: "#5A5A5A", description: "Avvaktande men orolig" },
          worried: { color: "#ED6C02", description: "Djupt bekymrad för säkerheten" },
          desperate: { color: "#C62828", description: "Desperat efter säkerhetslösningar" },
          relieved: { color: "#2E7D32", description: "Lättad över säkerhetstryggande beslut" }
        }
      },
      lasse: {
        id: "lasse",
        name: "Lasse", 
        role: "Hemtjänstpersonal",
        personality: "Stressad, orolig för mer administration, praktiskt inriktad",
        description: "Hemtjänstpersonal som är orolig för ökad arbetsbelastning", 
        avatar: "medical_services",
        emotionalStates: {
          neutral: { color: "#5A5A5A", description: "Professionell men pressad" },
          stressed: { color: "#ED6C02", description: "Stressad över ökad administration" },
          overwhelmed: { color: "#C62828", description: "Överväldigad av nya system" },
          supported: { color: "#2E7D32", description: "Känner stöd och förståelse" }
        }
      }
    },
    
    scenario: {
      title: "Dilemmat med det smarta trygghetslarmet",
      context: "Kommunen ska implementera ett smart trygghetslarm för äldre som kan upptäcka fall, övervaka hälsotillstånd och larma vid nödsituationer. Tekniken kan rädda liv men väcker frågor om integritet och autonomi.",
      setting: "Kommunal vårdcentral",
      stakeholders: ["Arne (omsorgstagare)", "Karin (anhörig)", "Lasse (personal)", "Du (digital strateg)"]
    },
    
    gameMetrics: {
      autonomy: {
        name: "Arnes Autonomi",
        description: "Arnes känsla av självbestämmande och integritet",
        color: "#2E7D32",
        icon: "person",
        minValue: 0,
        maxValue: 100,
        startValue: 50
      },
      security: {
        name: "Trygghet & Säkerhet", 
        description: "Säkerhetsnivå för Arne och Karins trygghetskänsla",
        color: "#0288D1",
        icon: "shield",
        minValue: 0,
        maxValue: 100,
        startValue: 30
      },
      staffWellbeing: {
        name: "Personalens Välmående",
        description: "Lasses arbetsbelastning och stress",
        color: "#FF8F00",
        icon: "favorite",
        minValue: 0,
        maxValue: 100,
        startValue: 40
      },
      budget: {
        name: "Projektbudget",
        description: "Tillgängliga resurser för implementering",
        startValue: 100,
        currency: "tkr"
      }
    },
    
    dialogueTree: {
      "start": {
        character: "player",
        text: "Välkomna alla till vårt möte om det nya trygghetslarmet. Vi behöver hitta en lösning som fungerar för alla parter.",
        narration: "Du sitter vid bordet med Arne, hans dotter Karin och hemtjänstpersonalen Lasse. Spänningen i rummet är påtaglig.",
        choices: [
          {
            text: "Låt oss börja med Arnes behov och önskemål.",
            effects: { autonomy: 10, security: 0, staff: 0, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "neutral", 
              lasse: "neutral"
            },
            nextNodeId: "arne_perspective"
          },
          {
            text: "Karin, kan du berätta om dina säkerhetsoro?",
            effects: { autonomy: -5, security: 10, staff: 0, budget: 0 },
            characterReactions: {
              arne: "concerned",
              karin: "relieved",
              lasse: "neutral"
            },
            nextNodeId: "karin_security_focus"
          },
          {
            text: "Lasse, hur påverkar detta ditt arbete?",
            effects: { autonomy: 0, security: 0, staff: 10, budget: 0 },
            characterReactions: {
              arne: "neutral",
              karin: "neutral",
              lasse: "supported"
            },
            nextNodeId: "lasse_workload_concern"
          }
        ]
      },
      
      "arne_perspective": {
        character: "arne",
        text: "Jag uppskattar att ni frågar. Jag vill inte känna mig som en fånge i mitt eget hem. Jag har klarat mig bra hittills.",
        emotion: "neutral",
        choices: [
          {
            text: "Vi förstår din självständighet, Arne. Låt oss se hur vi kan respektera den.",
            effects: { autonomy: 15, security: 0, staff: 0, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "worried",
              lasse: "neutral"
            },
            nextNodeId: "karin_responds_to_autonomy"
          },
          {
            text: "Men Arne, säkerheten är också viktig. Kan vi hitta en balans?",
            effects: { autonomy: -5, security: 5, staff: 0, budget: 0 },
            characterReactions: {
              arne: "concerned",
              karin: "relieved",
              lasse: "neutral"
            },
            nextNodeId: "balance_discussion"
          }
        ]
      },
      
      "karin_responds_to_autonomy": {
        character: "karin",
        text: "Jag förstår pappa, men jag har läst på internet. Jag vill att vi aktiverar allt - falldetektion, GPS-spårning, pulsövervakning. Jag kan inte sova på nätterna av oro.",
        emotion: "worried",
        choices: [
          {
            text: "Karin, din oro är förståelig. Låt oss hitta tekniska lösningar som känns trygga för alla.",
            effects: { autonomy: 0, security: 10, staff: 0, budget: -10 },
            characterReactions: {
              arne: "concerned",
              karin: "relieved",
              lasse: "neutral"
            },
            nextNodeId: "technical_compromise"
          },
          {
            text: "Vi behöver respektera Arnes önskemål först. Karin, finns det andra sätt att känna trygghet?",
            effects: { autonomy: 10, security: -5, staff: 0, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "worried",
              lasse: "neutral"
            },
            nextNodeId: "arne_gps_reaction"
          }
        ]
      },
      
      "arne_gps_reaction": {
        character: "arne",
        text: "GPS-spårning?! Ska ni ha en elektronisk fotboja på mig? Jag är ingen fånge! Det här blir för mycket.",
        emotion: "upset",
        choices: [
          {
            text: "Arne, lugna dig. Vi kommer inte genomföra något utan ditt godkännande.",
            effects: { autonomy: 15, security: -10, staff: 0, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "desperate",
              lasse: "neutral"
            },
            nextNodeId: "karin_desperate"
          },
          {
            text: "Låt oss prata om vilka funktioner som är absolut nödvändiga för säkerheten.",
            effects: { autonomy: 5, security: 5, staff: 0, budget: 0 },
            characterReactions: {
              arne: "neutral",
              karin: "worried",
              lasse: "neutral"
            },
            nextNodeId: "essential_features"
          }
        ]
      },
      
      "karin_desperate": {
        character: "karin",
        text: "Men vad händer om han faller och ingen hittar honom? Vad händer om han får en hjärtattack? Jag kan inte bära den skulden!",
        emotion: "desperate",
        choices: [
          {
            text: "Vi kan implementera grundläggande falldetektion som Arne kan stänga av vid behov.",
            effects: { autonomy: 10, security: 10, staff: 0, budget: -5 },
            characterReactions: {
              arne: "neutral",
              karin: "relieved",
              lasse: "neutral"
            },
            nextNodeId: "lasse_implementation_concern"
          },
          {
            text: "Låt oss utbilda Arne i hur han själv kan kontrollera systemet.",
            effects: { autonomy: 15, security: 5, staff: 5, budget: -15 },
            characterReactions: {
              arne: "satisfied",
              karin: "neutral",
              lasse: "supported"
            },
            nextNodeId: "training_solution"
          }
        ]
      },
      
      "lasse_implementation_concern": {
        character: "lasse",
        text: "Ursäkta, men vem ska hantera alla larm? Vi har redan för mycket att göra. Och vem ska lära Arne hur tekniken fungerar?",
        emotion: "stressed",
        choices: [
          {
            text: "Vi ska få extra resurser för utbildning och support.",
            effects: { autonomy: 0, security: 5, staff: 15, budget: -20 },
            characterReactions: {
              arne: "neutral",
              karin: "relieved",
              lasse: "supported"
            },
            nextNodeId: "resource_commitment"
          },
          {
            text: "Vi kan starta med en enklare version som inte kräver lika mycket administration.",
            effects: { autonomy: 5, security: 0, staff: 10, budget: -5 },
            characterReactions: {
              arne: "satisfied",
              karin: "worried",
              lasse: "supported"
            },
            nextNodeId: "simplified_solution"
          }
        ]
      },
      
      "resource_commitment": {
        character: "player",
        text: "Jag förbinder mig att se till att ni får utbildning, teknisk support och extra tid för implementeringen. Detta är en prioritet.",
        narration: "Du kan se hur spänningen i rummet minskar när alla förstår att deras behov tas på allvar.",
        choices: [
          {
            text: "Arne, är du okej med ett system du kan kontrollera själv?",
            effects: { autonomy: 10, security: 5, staff: 0, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "relieved",
              lasse: "supported"
            },
            nextNodeId: "consensus_building"
          },
          {
            text: "Låt oss alla komma överens om en grundläggande säkerhetsnivå.",
            effects: { autonomy: 5, security: 10, staff: 5, budget: 0 },
            characterReactions: {
              arne: "neutral",
              karin: "relieved",
              lasse: "supported"
            },
            nextNodeId: "final_agreement"
          }
        ]
      },
      
      "consensus_building": {
        character: "arne",
        text: "Om jag kan stänga av det när jag vill, och om det bara är falldetektion... ja, det låter rimligt.",
        emotion: "satisfied",
        choices: [
          {
            text: "Perfekt! Karin, känns detta tryggare för dig också?",
            effects: { autonomy: 5, security: 15, staff: 5, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "relieved",
              lasse: "supported"
            },
            nextNodeId: "successful_consensus"
          }
        ]
      },
      
      "successful_consensus": {
        character: "karin",
        text: "Ja... om pappa kan kontrollera det själv och ändå ha grundläggande skydd, då känner jag mig mycket bättre.",
        emotion: "relieved",
        choices: [
          {
            text: "Excellent! Lasse, ser du framför dig att detta fungerar i praktiken?",
            effects: { autonomy: 0, security: 0, staff: 10, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "relieved", 
              lasse: "supported"
            },
            nextNodeId: "final_consensus"
          }
        ]
      },
      
      "final_consensus": {
        character: "lasse",
        text: "Med rätt utbildning och support tror jag det kan fungera bra. Tack för att ni lyssnade på alla våra behov.",
        emotion: "supported",
        choices: [
          {
            text: "Då har vi en lösning som alla kan leva med. Mötet avslutat!",
            effects: { autonomy: 5, security: 5, staff: 5, budget: 0 },
            characterReactions: {
              arne: "satisfied",
              karin: "relieved",
              lasse: "supported"
            },
            nextNodeId: "end_success"
          }
        ]
      },
      
      "end_success": {
        character: "narrator",
        text: "Grattis! Du har navigerat ett komplext etiskt dilemma och hittat en lösning som respekterar alla parters behov.",
        isEnding: true,
        outcome: "Konsensuslösningen",
        outcomeDescription: "Genom empatisk kommunikation och kompromissvilja har du skapat en lösning som balanserar autonomi, säkerhet och praktiska behov."
      }
    },
    
    outcomes: {
      perfectConsensus: {
        id: "consensus",
        name: "Konsensuslösningen",
        description: "Alla parter känner sig hörda och nöjda med lösningen",
        requirements: { autonomy: 75, security: 75, staff: 75 },
        flScore: 1000,
        message: "Exceptionellt arbete! Du har skapat en lösning som alla kan stå bakom."
      },
      goodCompromise: {
        id: "compromise", 
        name: "Den Pragmatiska Kompromissen",
        description: "En balanserad lösning med mindre uppoffringar",
        requirements: { autonomy: 60, security: 60, staff: 60 },
        flScore: 700,
        message: "Bra arbete! Du har hittat en praktisk lösning som fungerar."
      },
      partialSuccess: {
        id: "partial",
        name: "Delvis Framgång",
        description: "Vissa parter är nöjda men viktiga behov har inte tillgodosetts",
        requirements: { autonomy: 40, security: 40, staff: 40 },
        flScore: 400,
        message: "Ett steg framåt, men mer arbete behövs för att hitta optimal balans."
      },
      failure: {
        id: "failure",
        name: "Implementeringsstopp",
        description: "Konflikterna kunde inte lösas och projektet stoppas",
        requirements: "below_minimum_thresholds",
        flScore: 100,
        message: "Tyvärr ledde meningsskiljaktigheterna till att projektet inte kunde genomföras."
      }
    }
  },

  // =============================================================================
  // COMPETENCE GAME: Kompetensresan
  // =============================================================================
  competenceGame: {
    metadata: {
      id: "kompetensresan",
      title: "Kompetensresan",
      description: "Utveckla organisationens digitala kompetens över 12 månader",
      estimatedTime: "20-25 minuter", 
      difficulty: "Medium"
    },
    
    gameConfig: {
      duration: 12, // months
      initialBudget: 50, // Kompetensmiljoner
      targetLaunch: "AI-plattform för medborgarservice",
      organization: "Myndigheten för Samhällsutveckling (FMS)"
    },
    
    competenceTypes: {
      base: {
        id: "base",
        name: "Digital Baskompetens", 
        description: "Grundläggande digitala färdigheter för alla medarbetare",
        icon: "book",
        color: "#2E7D32",
        startValue: 25,
        maxValue: 100
      },
      broad: {
        id: "broad", 
        name: "Digital Breddkompetens",
        description: "Tvärsektoriell digital förståelse och projektledning",
        icon: "psychology",
        color: "#0288D1", 
        startValue: 15,
        maxValue: 100
      },
      specialist: {
        id: "specialist",
        name: "Digital Spetskompetens", 
        description: "Avancerad teknisk expertis inom AI och innovation",
        icon: "precision_manufacturing",
        color: "#8E24AA",
        startValue: 5,
        maxValue: 100
      }
    },
    
    actionCards: [
      {
        id: "gdpr_elearning",
        name: "E-learning i GDPR",
        description: "Onlineutbildning för alla medarbetare om dataskydd",
        cost: 5,
        duration: 1,
        effects: { base: 10, broad: 5, specialist: 0 },
        category: "compliance"
      },
      {
        id: "data_visualization_workshop", 
        name: "Workshop i Datavisualisering",
        description: "Praktisk utbildning i att presentera data effektivt",
        cost: 8,
        duration: 1,
        effects: { base: 5, broad: 15, specialist: 5 },
        category: "analysis"
      },
      {
        id: "ai_consultant",
        name: "Anlita AI-konsult",
        description: "Extern expertis för strategisk AI-implementation",
        cost: 15,
        duration: 2,
        effects: { base: 0, broad: 10, specialist: 20 },
        category: "expertise"
      },
      {
        id: "inclusive_recruitment",
        name: "Satsning på Inkluderande Rekrytering",
        description: "Brett rekryteringsinitiativ för ökad mångfald",
        cost: 12,
        duration: 3,
        effects: { base: 8, broad: 12, specialist: 15 },
        category: "recruitment"
      },
      {
        id: "digital_leadership_program",
        name: "Program för Digital Ledning",
        description: "Ledarskapsutbildning för digital transformation",
        cost: 10,
        duration: 2,
        effects: { base: 5, broad: 20, specialist: 5 },
        category: "leadership"
      },
      {
        id: "agile_methodology_training",
        name: "Agile Metodikutbildning",
        description: "Implementera agila arbetssätt i organisationen",
        cost: 7,
        duration: 2,
        effects: { base: 10, broad: 15, specialist: 10 },
        category: "methodology"
      },
      {
        id: "cybersecurity_certification",
        name: "Cybersäkerhetscertifiering",
        description: "Specialistutbildning i säkerhetsområdet",
        cost: 13,
        duration: 3,
        effects: { base: 0, broad: 8, specialist: 25 },
        category: "security"
      },
      {
        id: "innovation_lab_setup",
        name: "Uppstart av Innovationslabb",
        description: "Skapa miljö för experimentering och prototyping",
        cost: 20,
        duration: 4,
        effects: { base: 5, broad: 15, specialist: 30 },
        category: "innovation"
      }
    ],
    
    eventCards: [
      {
        id: "budget_cut",
        name: "Budgetnedskärning",
        description: "Oväntade besparingar kräver effektivare resursanvändning",
        effects: { budget: -10 },
        probability: 0.15,
        triggerMonth: "random"
      },
      {
        id: "security_incident",
        name: "Säkerhetsincident",
        description: "Nytt säkerhetshot kräver omedelbar kompetensutveckling",
        effects: { specialist: -10, additionalCost: 5 },
        probability: 0.1,
        triggerMonth: "random"
      },
      {
        id: "ai_breakthrough",
        name: "AI Tekniksprång",
        description: "Tekniksprång: dina investeringar i AI ger nu dubbel effekt!",
        effects: { specialist: "*2" },
        probability: 0.08,
        triggerMonth: "late_game"
      },
      {
        id: "staff_turnover",
        name: "Personalomsättning",
        description: "Nyckelmedarbetare slutar, kompetens måste återuppbyggas",
        effects: { base: -15, broad: -10 },
        probability: 0.12,
        triggerMonth: "random"
      },
      {
        id: "new_regulation",
        name: "Ny EU-förordning",
        description: "Ny reglering kräver omedelbar compliance-utbildning",
        effects: { mandatoryTraining: "compliance", cost: 8 },
        probability: 0.1,
        triggerMonth: "random"
      },
      {
        id: "successful_pilot",
        name: "Framgångsrikt Pilotprojekt",
        description: "Ett framgångsrikt projekt höjer moralen och attraherar talang",
        effects: { base: 5, broad: 5, specialist: 5, recruitmentBonus: true },
        probability: 0.2,
        triggerMonth: "mid_game"
      }
    ],
    
    winConditions: {
      minimum: {
        base: 60,
        broad: 50, 
        specialist: 40,
        description: "Grundläggande kompetensnivåer för AI-plattformslansering"
      },
      optimal: {
        base: 80,
        broad: 70,
        specialist: 60,
        description: "Stark kompetensbas för framtida innovationer"
      },
      exceptional: {
        base: 90,
        broad: 85,
        specialist: 80,
        description: "Branschledande digital kompetens"
      }
    },
    
    ui: {
      title: "Kompetensresan: 12 månader till framtiden",
      introduction: "En ny AI-plattform ska lanseras, men personalens kompetensnivåer är för låga. Du har 12 månader och begränsad budget för att förbereda organisationen.",
      budgetLabel: "Budget: {value} Kompetensmiljoner",
      monthLabel: "Månad {current} av {total}",
      actionButton: "Genomför åtgärd",
      nextMonthButton: "Nästa månad",
      endGameButton: "Slutför resan"
    }
  },

  // =============================================================================
  // CONNECTIVITY GAME: Konnektivitetsvakten  
  // =============================================================================
  connectivityGame: {
    metadata: {
      id: "konnektivitetsvakten",
      title: "Konnektivitetsvakten", 
      description: "Bygg och försvara kritisk digital infrastruktur",
      estimatedTime: "25-30 minuter",
      difficulty: "Hard"
    },
    
    gameConfig: {
      region: "Norra Mälardalen",
      organization: "Nationellt Telesamverkanscenter",
      buildPhaseDuration: 600, // 10 minutes
      crisisPhaseDuration: 300, // 5 minutes
      initialBudget: 80,
      targetIndex: 85
    },
    
    infrastructure: {
      fiber: {
        id: "fiber",
        name: "Fiberoptisk Kabel",
        description: "Höghastighetsanslutning för stabil dataöverföring",
        cost: 8,
        resilience: 70,
        capacity: 100,
        vulnerabilities: ["physical_damage", "flooding"],
        icon: "cable"
      },
      "5g": {
        id: "5g",
        name: "5G Mast",
        description: "Trådlös kommunikation för mobil och IoT-anslutning", 
        cost: 12,
        resilience: 60,
        capacity: 80,
        vulnerabilities: ["storm", "power_outage"],
        icon: "cell_tower"
      },
      satellite: {
        id: "satellite",
        name: "Satellit Uplink",
        description: "Backup-kommunikation för kritiska situationer",
        cost: 20,
        resilience: 90,
        capacity: 50,
        vulnerabilities: ["solar_storm", "jamming"],
        icon: "satellite"
      },
      redundancy: {
        id: "redundancy",
        name: "Robusthetsuppgradering",
        description: "Förstärkning av befintlig infrastruktur",
        cost: 6,
        resilience: "+20",
        capacity: "+0",
        vulnerabilities: [],
        icon: "construction"
      }
    },
    
    locations: [
      {
        id: "central_city",
        name: "Centralorten",
        type: "urban",
        population: 50000,
        criticality: "high",
        position: { x: 300, y: 200 },
        connectedTo: [],
        infrastructure: []
      },
      {
        id: "hospital",
        name: "Regionsjukhuset",
        type: "critical",
        population: 1000,
        criticality: "critical",
        position: { x: 250, y: 150 },
        connectedTo: [],
        infrastructure: [],
        specialRequirements: ["ultra_low_latency", "redundant_connections"]
      },
      {
        id: "industrial_park",
        name: "Industripark",
        type: "industrial", 
        population: 5000,
        criticality: "high",
        position: { x: 400, y: 250 },
        connectedTo: [],
        infrastructure: []
      },
      {
        id: "rural_north",
        name: "Norra Glesbygden",
        type: "rural",
        population: 2000,
        criticality: "medium",
        position: { x: 200, y: 100 },
        connectedTo: [],
        infrastructure: []
      },
      {
        id: "hydroelectric",
        name: "Vattenkraftverk",
        type: "infrastructure",
        population: 100,
        criticality: "critical",
        position: { x: 150, y: 300 },
        connectedTo: [],
        infrastructure: [],
        specialRequirements: ["hardened_systems", "air_gap_capability"]
      }
    ],
    
    crisisEvents: [
      {
        id: "storm_east",
        name: "Stormbyar i Östra Regionen",
        description: "Kraftiga vindar hotar master och luftledningar",
        type: "weather",
        severity: "medium",
        duration: 60,
        affectedInfrastructure: ["5g", "power_lines"],
        affectedLocations: ["industrial_park", "rural_north"],
        requiredResponse: ["backup_power", "emergency_repair"]
      },
      {
        id: "cyber_attack_hydroelectric",
        name: "Cyberattack mot Vattenkraftverket",
        description: "Avancerad cyberattack försöker ta kontroll över kraftverket",
        type: "cyber",
        severity: "high", 
        duration: 45,
        affectedInfrastructure: ["all_connected_to_hydroelectric"],
        affectedLocations: ["hydroelectric"],
        requiredResponse: ["isolate_systems", "activate_backup"]
      },
      {
        id: "fiber_cut_accident",
        name: "Grävskada på Fiberkabel",
        description: "Byggnadsarbete har skadat huvudfiberlänken",
        type: "physical",
        severity: "medium",
        duration: 90,
        affectedInfrastructure: ["fiber"],
        affectedLocations: ["central_city", "hospital"],
        requiredResponse: ["reroute_traffic", "emergency_repair"]
      },
      {
        id: "solar_storm",
        name: "Geomagnetisk Storm", 
        description: "Solstorm påverkar satellitommunikation och elektronik",
        type: "natural",
        severity: "high",
        duration: 120,
        affectedInfrastructure: ["satellite", "electronics"],
        affectedLocations: ["all"],
        requiredResponse: ["terrestrial_backup", "hardened_systems"]
      },
      {
        id: "coordinated_attack",
        name: "Koordinerad Sabotage",
        description: "Samtidiga attacker mot flera kritiska noder",
        type: "sabotage",
        severity: "critical",
        duration: 180,
        affectedInfrastructure: ["random_multiple"],
        affectedLocations: ["critical_nodes"],
        requiredResponse: ["emergency_protocols", "all_backups"]
      }
    ],
    
    ui: {
      buildPhase: {
        title: "Byggfas: Infrastrukturutbyggnad",
        instructions: "Bygg robust digital infrastruktur mellan kritiska noder. Tänk på redundans och säkerhet.",
        budgetLabel: "Infrastrukturbudget: {value} miljoner",
        timeLabel: "Byggfas tid kvar: {minutes}:{seconds}",
        startCrisisButton: "Starta Krisen"
      },
      crisisPhase: {
        title: "Kris: Realtidshantering",
        instructions: "Hantera infrastrukturstörningar i realtid. Prioritera kritiska system.",
        timeLabel: "Tid kvar: {minutes}:{seconds}",
        indexLabel: "Samhällsindex: {value}%",
        activeIncidents: "Aktiva incidenter:",
        responseOptions: "Åtgärder:"
      }
    }
  },

  // =============================================================================
  // ECOSYSTEM GAME: Ekosystembyggaren
  // =============================================================================
  ecosystemGame: {
    metadata: {
      id: "ekosystembyggaren",
      title: "Ekosystembyggaren",
      description: "Bygg Sveriges digitala innovationsekosystem",
      estimatedTime: "30-35 minuter",
      difficulty: "Expert"
    },
    
    gameConfig: {
      duration: 10, // quarters
      organization: "Finansdepartementet - Nationell Digitaliseringsgrupp",
      initialBudget: 100, // Innovationsmiljarder
      scope: "national",
      successMetric: "digital_competitiveness_index"
    },
    
    nationalMetrics: {
      innovation: {
        id: "innovation",
        name: "Innovationskraft",
        description: "Förmåga att skapa och kommersialisera nya teknologier",
        icon: "lightbulb",
        color: "#8E24AA",
        startValue: 45,
        targetValue: 80,
        maxValue: 100
      },
      competitiveness: {
        id: "competitiveness", 
        name: "Konkurrenskraft",
        description: "Sveriges position på den globala digitala marknaden",
        icon: "trending_up",
        color: "#0288D1",
        startValue: 60,
        targetValue: 85,
        maxValue: 100
      },
      cybersecurity: {
        id: "cybersecurity",
        name: "Cybersäkerhet",
        description: "Nationell resiliens mot digitala hot",
        icon: "shield",
        color: "#C62828", 
        startValue: 70,
        targetValue: 90,
        maxValue: 100
      },
      sustainability: {
        id: "sustainability",
        name: "Hållbarhet",
        description: "Miljömässig hållbarhet i digitalisering",
        icon: "eco",
        color: "#2E7D32",
        startValue: 40,
        targetValue: 75,
        maxValue: 100
      }
    },
    
    companyEvolution: {
      startup: {
        id: "startup",
        name: "Startup",
        description: "Nystartade företag med innovativa idéer",
        icon: "rocket_launch",
        requirements: { funding: 2, regulation: "light" },
        contributions: { innovation: 10, jobs: 5 }
      },
      growth: {
        id: "growth",
        name: "Tillväxtbolag", 
        description: "Snabbväxande företag med skalbar affärsmodell",
        icon: "trending_up",
        requirements: { funding: 5, talent: "medium", infrastructure: "good" },
        contributions: { innovation: 15, competitiveness: 10, jobs: 25 }
      },
      enterprise: {
        id: "enterprise",
        name: "Storindustri",
        description: "Etablerade företag med internationell räckvidd",
        icon: "domain",
        requirements: { infrastructure: "excellent", regulation: "stable", talent: "high" },
        contributions: { competitiveness: 20, cybersecurity: 15, jobs: 100 }
      },
      unicorn: {
        id: "unicorn",
        name: "Enhörning",
        description: "Världsledande teknologiföretag värderade över 1 miljard USD",
        icon: "auto_awesome",
        requirements: { all_metrics: 75, ecosystem: "world_class" },
        contributions: { innovation: 30, competitiveness: 25, international_reputation: 50 }
      }
    },
    
    policyCards: [
      {
        id: "ai_sweden_hub",
        name: "Starta AI Sweden Hub",
        description: "Nationellt center för AI-forskning och innovation",
        cost: 15,
        duration: 4,
        effects: { innovation: 20, competitiveness: 10 },
        category: "research"
      },
      {
        id: "rd_tax_deduction",
        name: "FoU-avdrag för AI-forskning",
        description: "Skattelättnader för företag som investerar i AI-utveckling",
        cost: 10,
        duration: 8,
        effects: { innovation: 15, competitiveness: 15 },
        category: "taxation"
      },
      {
        id: "data_sharing_initiative",
        name: "Datadelningsinitiativ",
        description: "Säker delning av offentlig data för innovation",
        cost: 8,
        duration: 6,
        effects: { innovation: 18, cybersecurity: -5 },
        category: "regulation"
      },
      {
        id: "advanced_digitalization_funding",
        name: "Finansiera Avancerad Digitalisering",
        description: "Riktade investeringar i emerging technologies",
        cost: 20,
        duration: 3,
        effects: { innovation: 25, sustainability: 10 },
        category: "funding"
      },
      {
        id: "gdpr_simplification",
        name: "Förenklingspaket för GDPR-tolkning",
        description: "Tydligare riktlinjer för datahantering och innovation",
        cost: 5,
        duration: 2,
        effects: { competitiveness: 12, innovation: 8 },
        category: "regulation"
      },
      {
        id: "green_datacenter_subsidy",
        name: "Gröna Datacenter-subvention",
        description: "Stöd för miljövänliga datacenter och cloud services",
        cost: 12,
        duration: 6,
        effects: { sustainability: 20, competitiveness: 8 },
        category: "environment"
      },
      {
        id: "cybersecurity_excellence_program",
        name: "Program för Cybersäkerhetsexcellens",
        description: "Nationell satsning på cybersäkerhetskompetens",
        cost: 18,
        duration: 8,
        effects: { cybersecurity: 25, competitiveness: 5 },
        category: "security"
      },
      {
        id: "digital_skills_initiative",
        name: "Nationell Digital Kompetensinitiativ",
        description: "Bred kompetensutveckling för hela befolkningen",
        cost: 25,
        duration: 10,
        effects: { innovation: 15, competitiveness: 20, sustainability: 5 },
        category: "education"
      }
    ],
    
    marketEvents: [
      {
        id: "international_investment",
        name: "Internationell Tech-jätte Investerar",
        description: "Internationell tech-jätte investerar 2 miljarder i Sverige!",
        effects: { competitiveness: 15, innovation: 10, foreign_investment: true },
        probability: 0.15,
        triggerConditions: { competitiveness: 70 }
      },
      {
        id: "eu_regulation_complexity",
        name: "Komplex EU-reglering",
        description: "Ny, komplex EU-reglering skapar osäkerhet för tech-företag",
        effects: { competitiveness: -10, innovation: -5, regulatory_burden: true },
        probability: 0.2,
        triggerConditions: "random"
      },
      {
        id: "breakthrough_innovation",
        name: "Svensk Teknikgenombrott",
        description: "Svenskt företag gör banbrytande upptäckt inom quantum computing",
        effects: { innovation: 20, competitiveness: 15, international_attention: true },
        probability: 0.1,
        triggerConditions: { innovation: 75 }
      },
      {
        id: "cyber_incident_national",
        name: "Nationell Cyberincident",
        description: "Stor cyberattack mot kritisk infrastruktur skakar förtroendet",
        effects: { cybersecurity: -15, competitiveness: -10, security_focus: true },
        probability: 0.12,
        triggerConditions: { cybersecurity: 50 }
      },
      {
        id: "climate_pressure",
        name: "Ökade Klimatkrav",
        description: "Internationella klimatkrav ökar pressen på hållbar digitalisering",
        effects: { sustainability: 10, innovation: 5, cost_increase: 5 },
        probability: 0.18,
        triggerConditions: "time_based"
      },
      {
        id: "talent_shortage",
        name: "Global Kompetensbrist",
        description: "Internationell brist på tech-talang gynnar länder med bra utbildning",
        effects: { competitiveness: 10, innovation: 8 },
        probability: 0.15,
        triggerConditions: { education_investment: true }
      }
    ],
    
    winConditions: {
      minimum: {
        totalScore: 280,
        description: "Grundläggande digital konkurrenskraft uppnådd"
      },
      good: {
        totalScore: 320,
        unicorns: 1,
        description: "Stark digital nation med internationell konkurrenskraft"
      },
      excellent: {
        totalScore: 350,
        unicorns: 2,
        description: "Världsledande digitalt ekosystem"
      },
      perfect: {
        totalScore: 380,
        unicorns: 3,
        allMetrics: 85,
        description: "Global digital supermakt"
      }
    },
    
    ui: {
      title: "Ekosystembyggaren",
      introduction: "Du har kallats till den nationella digitaliseringsgruppen för att bygga Sveriges framtida konkurrenskraft. Med strategiska investeringar och kloka policies ska du skapa förutsättningar för digital excellens.",
      budgetLabel: "Strategisk Budget: {value} Innovationsmiljarder",
      quarterLabel: "Kvartal {current} av {total}",
      implementButton: "Implementera Policy",
      nextQuarterButton: "Nästa kvartal",
      metricsTitle: "Nationella Mätvärden",
      companiesTitle: "Företagsekosystem",
      eventsTitle: "Marknadshändelser"
    }
  }
};

export default gameContent;