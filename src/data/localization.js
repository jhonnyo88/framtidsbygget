/**
 * Localization Data - Framtidsbygget
 * 
 * Complete UI text and content localization for Swedish (primary) and English (future)
 */

export const localization = {
  // =============================================================================
  // LANGUAGE CONFIGURATION
  // =============================================================================
  languages: {
    sv: {
      code: "sv",
      name: "Svenska",
      native: "Svenska",
      default: true
    },
    en: {
      code: "en",
      name: "English",
      native: "English",
      default: false,
      available: false // Future implementation
    }
  },

  // =============================================================================
  // SWEDISH LOCALIZATION (PRIMARY)
  // =============================================================================
  sv: {
    // Common UI Elements
    common: {
      continue: "Fortsätt",
      cancel: "Avbryt",
      close: "Stäng",
      back: "Tillbaka",
      next: "Nästa",
      finish: "Slutför",
      retry: "Försök igen",
      loading: "Laddar...",
      saving: "Sparar...",
      error: "Fel uppstod",
      success: "Framgång!",
      confirm: "Bekräfta",
      skip: "Hoppa över",
      start: "Starta",
      pause: "Pausa",
      resume: "Återuppta",
      quit: "Avsluta",
      yes: "Ja",
      no: "Nej",
      ok: "OK",
      save: "Spara",
      load: "Ladda",
      delete: "Ta bort",
      edit: "Redigera",
      view: "Visa",
      search: "Sök",
      filter: "Filtrera",
      sort: "Sortera",
      refresh: "Uppdatera",
      download: "Ladda ner",
      upload: "Ladda upp",
      share: "Dela",
      help: "Hjälp",
      info: "Information",
      warning: "Varning",
      settings: "Inställningar",
      logout: "Logga ut",
      welcome: "Välkommen",
      congratulations: "Grattis!",
      thankyou: "Tack!",
      sorry: "Ursäkta",
      please: "Vänligen",
      optional: "Valfritt",
      required: "Obligatoriskt",
      enabled: "Aktiverad",
      disabled: "Inaktiverad",
      on: "På",
      off: "Av",
      new: "Ny",
      old: "Gammal",
      all: "Alla",
      none: "Ingen",
      select: "Välj",
      selected: "Vald",
      unselect: "Avmarkera",
      reset: "Återställ",
      default: "Standard",
      custom: "Anpassad",
      automatic: "Automatisk",
      manual: "Manuell"
    },

    // Navigation
    navigation: {
      dashboard: "Översikt",
      compass: "Min Kompass",
      achievements: "Utmärkelser",
      settings: "Inställningar",
      help: "Hjälp",
      about: "Om Framtidsbygget",
      profile: "Min Profil",
      progress: "Framsteg",
      leaderboard: "Topplista",
      statistics: "Statistik",
      missions: "Uppdrag",
      tutorial: "Handledning"
    },

    // Main Dashboard
    dashboard: {
      title: "Framtidsbygget",
      subtitle: "Sveriges Digitala Strategiresan",
      mission_report: "Uppdragsrapport",
      total_score: "Total FL-poäng",
      your_score: "Dina FL-poäng",
      completed_missions: "Avklarade Uppdrag",
      unlocked_synergies: "Upplåsta Synergier",
      digital_compass: "Digitala Kompassen",
      available_missions: "Tillgängliga Uppdrag",
      locked_missions: "Låsta Uppdrag",
      mission_progress: "{completed} av {total} uppdrag slutförda",
      welcome_back: "Välkommen tillbaka, {name}!",
      first_time: "Välkommen till din digitala strategiresa!",
      session_time: "Sessionstid: {time}",
      last_played: "Senast spelat: {date}",
      next_objective: "Nästa mål",
      quick_actions: "Snabbåtgärder",
      resume_game: "Återuppta spel",
      view_achievements: "Visa utmärkelser",
      open_compass: "Öppna kompassen"
    },

    // Onboarding
    onboarding: {
      welcome: {
        title: "Välkommen, Digital Strateg",
        subtitle: "Du har utsetts att leda Sveriges digitala transformation",
        description: "Som nationell digital strateg är det din uppgift att navigera Sverige genom den digitala revolutionen. Dina beslut kommer att forma landets teknologiska framtid.",
        ready_check: "Är du redo att börja bygga framtiden?",
        ready_button: "Jag är redo",
        skip_intro: "Hoppa över introduktion"
      },
      step1: {
        title: "Din Digitala Kompass",
        description: "Detta är din Digitala Kompass - ditt viktigaste verktyg för att navigera Sveriges digitaliseringsstrategi. Här kan du utforska hur olika delar av strategin hänger samman.",
        instruction: "Klicka på kompass-ikonen för att utforska",
        tooltip: "Din strategiska översikt"
      },
      step2: {
        title: "Uppdrag Väntar",
        description: "Fem kritiska uppdrag väntar på dig. Varje uppdrag representerar en viktig del av Sveriges digitala transformation.",
        instruction: "Välj ett uppdrag på kartan för att börja",
        tooltip: "Klicka här för att starta"
      },
      step3: {
        title: "FL-poäng och Framsteg",
        description: "Du samlar Förändringsledarpoäng (FL-poäng) genom att slutföra uppdrag. Dessa poäng visar din påverkan som digital strateg.",
        instruction: "Håll koll på dina poäng här",
        tooltip: "Din strategiska påverkan"
      },
      step4: {
        title: "Synergier och Samverkan",
        description: "Genom att prestera väl i uppdragen låser du upp synergier - kraftfulla kopplingar mellan olika delar av digitaliseringsstrategin.",
        instruction: "Upptäck synergier genom excellens",
        tooltip: "Strategisk samverkan"
      },
      complete: {
        title: "Du är Redo!",
        description: "Nu förstår du grunderna. Lycka till med att bygga Sveriges digitala framtid!",
        start_button: "Påbörja resan",
        review_button: "Se introduktionen igen"
      }
    },

    // Digital Compass
    compass: {
      title: "Den Digitala Kompassen",
      subtitle: "Sveriges Digitaliseringsstrategi",
      description: "Utforska hur olika delar av digitaliseringsstrategin hänger samman",
      node_locked: "Låst - Slutför relaterade uppdrag för att låsa upp",
      node_unlocked: "Upplåst - Klicka för att läsa mer",
      node_mastered: "Bemästrad - Du har full förståelse för detta område",
      related_game: "Praktiseras i uppdraget:",
      no_related_game: "Ingen praktisk tillämpning tillgänglig",
      unlock_requirements: "Upplåsningskrav:",
      mastery_requirements: "Mästerskapskrav:",
      connections: "Kopplingar:",
      synergies: "Synergier:",
      progress: "Framsteg: {percent}%",
      total_nodes: "Totalt antal noder: {count}",
      unlocked_nodes: "Upplåsta noder: {count}",
      mastered_nodes: "Bemästrade noder: {count}",
      explore_prompt: "Välj en nod i kompassen för att läsa mer om strategin",
      back_to_overview: "Tillbaka till översikt",
      close_compass: "Stäng kompassen"
    },

    // Game Metadata
    games: {
      puzzle: {
        id: "pussel-spel-datasystem",
        title: "Säker Datasystem",
        subtitle: "Bygg en sammanhållen digital infrastruktur",
        description: "Bygg en säker och sammanhållen digital infrastruktur för myndigheten. Koppla datakällor genom den centrala Ena-hubben samtidigt som du säkerställer datasäkerhet.",
        objective: "Anslut alla interna system via säker infrastruktur",
        difficulty: "Medel",
        estimatedTime: "10-15 minuter",
        skills: ["Systemtänkande", "Säkerhetsprioriteringar", "Resurshantering"],
        unlockRequirement: "Tillgänglig från start"
      },
      welfare: {
        id: "valfards-dilemma",
        title: "Välfärdens Dilemma",
        subtitle: "Navigera etiska val i välfärdsteknologi",
        description: "Navigera etiska val i digitalisering av välfärdstjänster. Balansera integritet, säkerhet och personalens arbetsmiljö i implementeringen av smart trygghetslarm.",
        objective: "Nå konsensus mellan alla intressenter",
        difficulty: "Svår",
        estimatedTime: "15-20 minuter",
        skills: ["Empati", "Förhandling", "Etiskt beslutsfattande"],
        unlockRequirement: "Tillgänglig från start"
      },
      competence: {
        id: "kompetensresan",
        title: "Kompetensresan",
        subtitle: "Utveckla organisatorisk digital kapacitet",
        description: "Utveckla organisationens digitala kompetens över 12 månader. Balansera budget och strategiska val för att förbereda för AI-plattformslansering.",
        objective: "Uppnå kompetensmål inom budget och tid",
        difficulty: "Medel",
        estimatedTime: "20-25 minuter",
        skills: ["Strategisk planering", "Budgethantering", "Kompetensutveckling"],
        unlockRequirement: "Tillgänglig från start"
      },
      connectivity: {
        id: "konnektivitetsvakten",
        title: "Konnektivitetsvakten",
        subtitle: "Bygg och försvara kritisk infrastruktur",
        description: "Bygg och försvara kritisk digital infrastruktur. Först bygger du robust nätverk, sedan hanterar du kriser i realtid.",
        objective: "Upprätthåll samhällets digitala funktion",
        difficulty: "Svår",
        estimatedTime: "25-30 minuter",
        skills: ["Krishantering", "Infrastrukturplanering", "Snabba beslut"],
        unlockRequirement: "Tillgänglig från start"
      },
      ecosystem: {
        id: "ekosystembyggaren",
        title: "Ekosystembyggaren",
        subtitle: "Forma nationell digital konkurrenskraft",
        description: "Bygg Sveriges digitala innovationsekosystem. Implementera strategiska policies för att främja innovation och konkurrenskraft.",
        objective: "Skapa världsledande digitalt ekosystem",
        difficulty: "Expert",
        estimatedTime: "30-35 minuter",
        skills: ["Systemperspektiv", "Policyutveckling", "Långsiktig strategi"],
        unlockRequirement: "Tillgänglig från start"
      }
    },

    // Game-Specific UI Text
    gameUI: {
      // Puzzle Game
      puzzle: {
        instructions: {
          main: "Dra anslutningar från källorna, via Ena-hubben, till de interna systemen som behöver data.",
          tip1: "Alla anslutningar måste gå genom Ena-hubben för säkerhet",
          tip2: "Vissa system kräver modernisering innan anslutning",
          tip3: "Håll koll på din budget - moderniseringar kostar"
        },
        budget: "Budget: {amount} kr",
        moves: "Antal kopplingar: {count}",
        time: "Tid: {minutes}:{seconds}",
        modernization: {
          title: "Modernisering krävs",
          description: "Detta system ('{systemName}') är föråldrat och måste standardiseras innan det kan anslutas till Ena-infrastrukturen. Moderniseringen kommer att göra systemet säkrare och mer kompatibelt.",
          cost: "Kostnad: {amount} budgetenheter",
          approve: "Godkänn investering",
          cancel: "Avbryt"
        },
        insufficient_funds: {
          title: "Otillräcklig budget",
          description: "Du har inte tillräckligt med budget för att genomföra denna modernisering. Överväg andra lösningar eller optimera dina resurser.",
          understand: "Förstått"
        },
        connection_error: {
          title: "Ogiltig anslutning",
          description: "Denna anslutning är inte tillåten. Alla system måste anslutas via Ena-hubben.",
          retry: "Försök igen"
        },
        systems: {
          skatteverket: "Skatteverket",
          bolagsverket: "Bolagsverket",
          forsakringskassan: "Försäkringskassan",
          lantmateriet: "Lantmäteriet",
          ena_hub: "Ena-hubben",
          tillstandsenheten: "Tillståndsenheten",
          analysavdelningen: "Analysavdelningen",
          medborgarservice: "Medborgarservice"
        }
      },

      // Welfare Game
      welfare: {
        scenario: {
          title: "Dilemmat med det smarta trygghetslarmet",
          context: "Du är inkallad som digital strateg för att leda ett möte om implementering av smart trygghetslarm för äldre. Tekniken kan rädda liv men väcker frågor om integritet och autonomi.",
          participants: "Mötesdeltagare: Arne (omsorgstagare), Karin (anhörig), Lasse (personal), Du (ordförande)"
        },
        meters: {
          autonomy: "Arnes Autonomi",
          security: "Trygghet & Säkerhet",
          staff: "Personalens Välmående",
          budget: "Projektbudget: {amount} tkr"
        },
        characters: {
          player: "Du",
          arne: "Arne (82 år)",
          karin: "Karin (Arnes dotter)",
          lasse: "Lasse (Hemtjänstpersonal)"
        },
        emotions: {
          neutral: "Neutral",
          concerned: "Orolig",
          upset: "Upprörd",
          satisfied: "Nöjd",
          worried: "Bekymrad",
          desperate: "Desperat",
          relieved: "Lättad",
          stressed: "Stressad",
          overwhelmed: "Överväldigad",
          supported: "Stöttad"
        },
        dialogue: {
          thinking: "Överväger dina alternativ...",
          speaking: "{character} säger:",
          narration: "Berättare:",
          your_response: "Ditt svar:"
        }
      },

      // Competence Game
      competence: {
        header: {
          title: "Kompetensresan: 12 månader till framtiden",
          month: "Månad {current} av {total}",
          budget: "Budget: {amount} Kompetensmiljoner",
          ai_launch: "AI-lansering om {months} månader"
        },
        competences: {
          base: {
            name: "Digital Baskompetens",
            description: "Grundläggande digitala färdigheter för alla"
          },
          broad: {
            name: "Digital Breddkompetens",
            description: "Tvärsektoriell digital förståelse"
          },
          specialist: {
            name: "Digital Spetskompetens",
            description: "Avancerad teknisk expertis"
          }
        },
        actions: {
          select_card: "Välj åtgärd att genomföra",
          implement: "Genomför åtgärd",
          skip_month: "Hoppa över månad",
          no_budget: "Otillräcklig budget för denna åtgärd"
        },
        events: {
          positive: "Positiv händelse!",
          negative: "Utmaning!",
          neutral: "Händelse",
          continue: "Fortsätt"
        },
        cards: {
          cost: "Kostnad: {amount} miljoner",
          duration: "Varaktighet: {months} månad(er)",
          effects: "Effekter:",
          category: "Kategori: {category}"
        }
      },

      // Connectivity Game
      connectivity: {
        phases: {
          build: {
            title: "Byggfas: Infrastrukturutbyggnad",
            description: "Bygg robust digital infrastruktur mellan kritiska noder. Tänk på redundans och säkerhet.",
            budget: "Infrastrukturbudget: {amount} miljoner",
            time: "Byggfas tid kvar: {minutes}:{seconds}",
            start_crisis: "Starta Krisen",
            ready_check: "Är du redo för krisfasen?"
          },
          crisis: {
            title: "Kris: Realtidshantering",
            description: "Hantera infrastrukturstörningar i realtid. Prioritera kritiska system.",
            time: "Tid kvar: {minutes}:{seconds}",
            index: "Samhällsindex: {value}%",
            incidents: "Aktiva incidenter:",
            responses: "Åtgärder:"
          }
        },
        infrastructure: {
          fiber: "Fiberoptisk Kabel",
          "5g": "5G Mast",
          satellite: "Satellit Uplink",
          redundancy: "Robusthetsuppgradering"
        },
        locations: {
          central_city: "Centralorten",
          hospital: "Regionsjukhuset",
          industrial_park: "Industripark",
          rural_north: "Norra Glesbygden",
          hydroelectric: "Vattenkraftverk"
        },
        crisis_events: {
          storm: "Stormbyar",
          cyber_attack: "Cyberattack",
          fiber_cut: "Grävskada",
          solar_storm: "Solstorm",
          sabotage: "Sabotage"
        },
        responses: {
          backup_power: "Aktivera reservkraft",
          emergency_repair: "Nödreparation",
          isolate_systems: "Isolera system",
          activate_backup: "Aktivera backup",
          reroute_traffic: "Omdirigera trafik",
          hardened_mode: "Förstärkt läge"
        }
      },

      // Ecosystem Game
      ecosystem: {
        header: {
          title: "Ekosystembyggaren",
          quarter: "Kvartal {current} av {total}",
          budget: "Strategisk Budget: {amount} Innovationsmiljarder",
          year: "År {year}"
        },
        metrics: {
          title: "Nationella Mätvärden",
          innovation: "Innovationskraft",
          competitiveness: "Konkurrenskraft",
          cybersecurity: "Cybersäkerhet",
          sustainability: "Hållbarhet"
        },
        companies: {
          title: "Företagsekosystem",
          startup: "Startups",
          growth: "Tillväxtbolag",
          enterprise: "Storindustri",
          unicorn: "Enhörningar",
          total: "Totalt: {count} företag"
        },
        policies: {
          implement: "Implementera Policy",
          active: "Aktiva policies",
          queue: "Policykö",
          cost: "Kostnad: {amount} miljarder",
          duration: "Varaktighet: {quarters} kvartal",
          effects: "Förväntade effekter"
        },
        events: {
          market: "Marknadshändelse",
          global: "Global påverkan",
          domestic: "Inhemsk utveckling",
          technology: "Teknikgenombrott"
        },
        categories: {
          research: "Forskning & Utveckling",
          taxation: "Skatteincitament",
          regulation: "Reglering",
          funding: "Finansiering",
          environment: "Miljö & Hållbarhet",
          security: "Säkerhet",
          education: "Utbildning"
        }
      }
    },

    // Results & Feedback
    results: {
      mission_complete: "Uppdrag Slutfört!",
      mission_failed: "Uppdraget Kräver Mer Arbete",
      score_awarded: "FL-poäng Tilldelade: {score}",
      time_taken: "Tid: {time}",
      performance: "Prestation: {rating}",
      
      ratings: {
        perfect: "Perfekt",
        excellent: "Utmärkt",
        good: "Bra",
        satisfactory: "Tillfredsställande",
        needs_improvement: "Behöver förbättras"
      },
      
      new_achievement: "Ny Utmärkelse!",
      achievements_unlocked: "{count} utmärkelser upplåsta",
      synergy_unlocked: "Synergi Upplåst!",
      compass_updated: "Kompass Uppdaterad",
      
      breakdown: {
        title: "Resultatsammanställning",
        base_score: "Grundpoäng",
        time_bonus: "Tidsbonus",
        efficiency_bonus: "Effektivitetsbonus",
        perfect_bonus: "Perfekt bonus",
        total: "Totalt"
      },
      
      feedback: {
        puzzle: {
          perfect: "Exceptionell systemarkitektur! Du har skapat en säker och effektiv infrastruktur som kommer att tjäna medborgarna väl.",
          good: "Bra arbete! Din lösning fungerar väl, även om det finns utrymme för optimering.",
          poor: "Systemet fungerar, men säkerhetsbrister och ineffektivitet kommer att skapa problem framöver."
        },
        welfare: {
          consensus: "Fantastiskt! Du har navigerat ett komplext etiskt dilemma och hittat en lösning som respekterar alla parters behov.",
          compromise: "Bra kompromiss! Även om alla inte är helt nöjda har du hittat en praktisk väg framåt.",
          failure: "Tyvärr ledde meningsskiljaktigheterna till att projektet inte kunde genomföras. Alla förlorar."
        },
        competence: {
          excellent: "Imponerande kompetensutveckling! Organisationen är mer än redo för AI-revolutionen.",
          good: "Solid kompetensgrund lagd. Organisationen är redo, om än med vissa luckor.",
          poor: "Otillräcklig förberedelse. AI-lanseringen riskerar att misslyckas utan rätt kompetens."
        },
        connectivity: {
          perfect: "Mästerlig krishantering! Din infrastruktur höll emot alla påfrestningar.",
          good: "Stabil prestanda under press. Vissa störningar men systemet höll.",
          poor: "Allvarliga infrastrukturbrister ledde till omfattande samhällsstörningar."
        },
        ecosystem: {
          worldclass: "Du har skapat ett världsledande digitalt ekosystem! Sverige är nu en global digital supermakt.",
          strong: "Starkt ekosystem byggt! Sverige har tagit betydande steg mot digital excellens.",
          weak: "Ekosystemet är fragmenterat och svagt. Sverige riskerar att hamna efter i den digitala revolutionen."
        }
      },
      
      actions: {
        continue: "Fortsätt till översikt",
        retry: "Försök igen",
        view_details: "Visa detaljer",
        share_result: "Dela resultat",
        next_mission: "Nästa uppdrag"
      }
    },

    // Finale
    finale: {
      title: "Årsrapporten till Nationen",
      subtitle: "Din Digitala Strategiresan är Slutförd",
      
      introduction: "Som nationell digital strateg har du navigerat Sverige genom en kritisk period av digital transformation. Nu är det dags att summera din påverkan.",
      
      choice_prompt: "I din årsrapport till nationen, vilken av dina framgångar vill du lyfta fram?",
      
      leadership_profile: {
        title: "Din Ledarskapsprofil",
        visionary: "Visionär Strateg",
        pragmatic: "Pragmatisk Problemlösare",
        innovative: "Innovativ Förändringsagent",
        collaborative: "Samverkansbyggare",
        resilient: "Resilient Krishanterare"
      },
      
      strategic_impact: {
        title: "Ditt Strategiska Avtryck",
        infrastructure: "Digital Infrastruktur",
        innovation: "Innovationskraft",
        competence: "Kompetensutveckling",
        inclusion: "Digital Inkludering",
        security: "Cybersäkerhet"
      },
      
      final_score: {
        title: "Slutgiltig FL-poäng",
        breakdown: "Poängfördelning",
        rank: "Din rang: {rank}",
        percentile: "Bättre än {percent}% av alla strateger"
      },
      
      achievements_summary: {
        title: "Dina Utmärkelser",
        earned: "{count} av {total} utmärkelser uppnådda",
        rarest: "Sällsyntaste utmärkelse: {achievement}"
      },
      
      legacy: {
        title: "Ditt Arv",
        excellent: "Du lämnar efter dig ett Sverige som är redo att leda den digitala framtiden. Din vision och ditt ledarskap har skapat grunden för generationer av innovation.",
        good: "Du har gjort betydande framsteg i Sveriges digitalisering. Även om utmaningar kvarstår har du lagt en solid grund för framtiden.",
        adequate: "Du har tagit de första stegen mot digital transformation. Mycket arbete återstår, men resan har börjat."
      },
      
      statistics: {
        title: "Spelstatistik",
        total_time: "Total speltid: {time}",
        decisions_made: "Beslut fattade: {count}",
        crises_handled: "Kriser hanterade: {count}",
        synergies_created: "Synergier skapade: {count}",
        people_impacted: "Människor påverkade: {count}"
      },
      
      actions: {
        view_certificate: "Visa Diplom",
        play_again: "Spela Igen",
        share_results: "Dela Resultat",
        view_credits: "Visa Eftertexter",
        exit_game: "Avsluta Spel"
      }
    },

    // Achievements
    achievements: {
      title: "Utmärkelser",
      subtitle: "Dina prestationer som Digital Strateg",
      
      categories: {
        gameplay: "Spelframsteg",
        mastery: "Mästerskap",
        strategy: "Strategisk Excellens",
        exploration: "Utforskning",
        social: "Samverkan"
      },
      
      rarity: {
        common: "Vanlig",
        uncommon: "Ovanlig",
        rare: "Sällsynt",
        epic: "Episk",
        legendary: "Legendarisk"
      },
      
      status: {
        locked: "Låst",
        unlocked: "Upplåst",
        progress: "Pågående: {progress}",
        hidden: "Dold utmärkelse"
      },
      
      actions: {
        view_all: "Visa alla",
        filter_category: "Filtrera kategori",
        filter_rarity: "Filtrera sällsynthet",
        sort_by: "Sortera efter",
        share: "Dela utmärkelse"
      }
    },

    // Settings
    settings: {
      title: "Inställningar",
      
      categories: {
        game: "Spel",
        audio: "Ljud",
        graphics: "Grafik",
        accessibility: "Tillgänglighet",
        privacy: "Integritet",
        account: "Konto"
      },
      
      game: {
        language: "Språk",
        difficulty: "Svårighetsgrad",
        hints: "Visa tips",
        tutorials: "Handledningar",
        auto_save: "Automatisk sparning"
      },
      
      audio: {
        master_volume: "Huvudvolym",
        music_volume: "Musikvolym",
        effects_volume: "Effektvolym",
        dialogue_volume: "Dialogvolym",
        mute_all: "Stäng av allt ljud"
      },
      
      graphics: {
        quality: "Grafikkvalitet",
        resolution: "Upplösning",
        fullscreen: "Helskärm",
        animations: "Animationer",
        particle_effects: "Partikeleffekter"
      },
      
      accessibility: {
        colorblind_mode: "Färgblindläge",
        high_contrast: "Hög kontrast",
        large_text: "Stor text",
        reduce_motion: "Minska rörelse",
        screen_reader: "Skärmläsarstöd"
      },
      
      privacy: {
        analytics: "Tillåt analys",
        data_collection: "Datainsamling",
        third_party: "Tredjepartstjänster",
        delete_data: "Radera mina data",
        export_data: "Exportera mina data"
      },
      
      actions: {
        save: "Spara inställningar",
        reset: "Återställ standard",
        cancel: "Avbryt"
      }
    },

    // Help & Tutorial
    help: {
      title: "Hjälp & Handledning",
      
      topics: {
        getting_started: "Komma igång",
        game_mechanics: "Spelmekanik",
        scoring: "Poängsystem",
        achievements: "Utmärkelser",
        compass: "Digitala Kompassen",
        troubleshooting: "Felsökning"
      },
      
      faq: {
        title: "Vanliga frågor",
        q1: "Hur sparas mitt framsteg?",
        a1: "Ditt framsteg sparas automatiskt efter varje slutfört uppdrag.",
        q2: "Kan jag spela om uppdrag?",
        a2: "Ja, du kan spela om alla uppdrag för att förbättra ditt resultat.",
        q3: "Vad är FL-poäng?",
        a3: "Förändringsledarpoäng visar din påverkan som digital strateg.",
        q4: "Hur låser jag upp synergier?",
        a4: "Synergier låses upp genom exceptionella prestationer i specifika uppdrag."
      },
      
      contact: {
        title: "Kontakta support",
        email: "support@framtidsbygget.se",
        response_time: "Vi svarar inom 24 timmar"
      }
    },

    // Error Messages
    errors: {
      generic: "Ett fel uppstod. Försök igen senare.",
      network: "Nätverksfel. Kontrollera din internetanslutning.",
      auth: "Autentiseringsfel. Försök logga in igen.",
      save_failed: "Kunde inte spara. Dina framsteg kan gå förlorade.",
      load_failed: "Kunde inte ladda data. Försök igen.",
      game_crash: "Spelet kraschade. Laddar om...",
      
      recovery: {
        retry: "Försök igen",
        reload: "Ladda om sidan",
        contact: "Kontakta support",
        report: "Rapportera fel"
      }
    },

    // Accessibility
    accessibility: {
      aria: {
        main_menu: "Huvudmeny",
        game_area: "Spelområde",
        score_display: "Poängvisning",
        navigation: "Navigation",
        modal_dialog: "Dialogruta",
        close_button: "Stäng knapp",
        continue_button: "Fortsätt knapp",
        loading: "Laddar innehåll",
        game_paused: "Spelet pausat",
        achievement_unlocked: "Utmärkelse upplåst"
      }
    }
  },

  // =============================================================================
  // ENGLISH LOCALIZATION (FUTURE IMPLEMENTATION)
  // =============================================================================
  en: {
    // Placeholder for future English translation
    common: {
      continue: "Continue",
      cancel: "Cancel",
      close: "Close"
      // ... to be completed
    }
  }
};

// =============================================================================
// LOCALIZATION HELPER FUNCTIONS
// =============================================================================

export const i18n = {
  currentLanguage: 'sv',
  
  /**
   * Get localized text
   * @param {string} key - Dot notation key (e.g., 'common.continue')
   * @param {object} params - Parameters for interpolation
   * @returns {string} Localized text
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = localization[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    // Interpolate parameters
    return value.replace(/{(\w+)}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  },
  
  /**
   * Change current language
   * @param {string} lang - Language code
   */
  setLanguage(lang) {
    if (localization.languages[lang] && localization[lang]) {
      this.currentLanguage = lang;
      return true;
    }
    console.error(`Language not available: ${lang}`);
    return false;
  },
  
  /**
   * Get current language info
   */
  getCurrentLanguage() {
    return localization.languages[this.currentLanguage];
  },
  
  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    return Object.values(localization.languages).filter(lang => 
      lang.available !== false
    );
  },
  
  /**
   * Format number according to locale
   */
  formatNumber(number) {
    const locale = this.currentLanguage === 'sv' ? 'sv-SE' : 'en-US';
    return new Intl.NumberFormat(locale).format(number);
  },
  
  /**
   * Format date according to locale
   */
  formatDate(date, options = {}) {
    const locale = this.currentLanguage === 'sv' ? 'sv-SE' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(date);
  },
  
  /**
   * Format time duration
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return this.t('common.duration_hours', { 
        hours, 
        minutes: minutes.toString().padStart(2, '0'),
        seconds: secs.toString().padStart(2, '0')
      });
    } else {
      return this.t('common.duration_minutes', {
        minutes,
        seconds: secs.toString().padStart(2, '0')
      });
    }
  }
};

export default localization;