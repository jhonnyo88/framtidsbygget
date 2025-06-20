# Asset Requirements - Framtidsbygget

**Version:** 1.0  
**Status:** Implementation-Ready  
**Syfte:** Komplett specifikation av alla assets som behövs för Framtidsbygget

---

## Asset Architecture Overview

### Asset Organization Structure
```
public/assets/
├── icons/              # Material Symbols icons (SVG)
├── images/             # Game graphics and illustrations  
│   ├── backgrounds/    # Background images
│   ├── characters/     # Character avatars
│   ├── ui/            # UI elements and decorations
│   └── maps/          # Map graphics and overlays
├── audio/             # Sound effects and music
│   ├── ui/            # UI sound effects
│   ├── ambient/       # Background ambient sounds
│   └── feedback/      # Game feedback sounds
└── data/              # Static data files
    └── manifests/     # Asset loading manifests
```

### Performance Specifications
- **Icons**: SVG format, < 5KB each, optimized for scalability
- **Images**: SVG preferred, PNG fallback, WebP for photos
- **Audio**: MP3 format, < 100KB each, compressed for web
- **Total Bundle**: < 2MB initial load, lazy loading for game assets

---

## Icons (Material Symbols Outlined)

### Core UI Icons

| Icon Name | Usage | Component | Description |
|-----------|-------|-----------|-------------|
| `close` | Modal close buttons | All modals | Standard close/dismiss action |
| `check_circle` | Completed states | MainDashboard, Results | Success confirmation |
| `lock` | Locked content | MapView, Compass | Inaccessible features |
| `lock_open` | Unlocked content | MapView, Compass | Available features |
| `explore` | Compass navigation | MainDashboard | Digital Compass access |
| `menu` | Mobile navigation | Header | Mobile menu toggle |
| `settings` | Settings access | Header | App configuration |
| `help` | Help and tutorials | Header | User assistance |
| `info` | Information display | Various | Contextual information |
| `arrow_forward` | Navigation forward | Onboarding, Games | Continue/proceed |
| `arrow_back` | Navigation back | Various | Return/previous |
| `refresh` | Retry actions | Error states | Reload/restart |
| `download` | Asset loading | LoadingScreen | Download progress |
| `cloud_sync` | Save status | Header | Cloud synchronization |

### Dashboard & Framework Icons

| Icon Name | Usage | Component | Description |
|-----------|-------|-----------|-------------|
| `dashboard` | Main dashboard | Navigation | Home/overview |
| `map` | Regional map view | MainDashboard | Sweden map interface |
| `leaderboard` | Score display | Scoreboard | FL-poäng tracking |
| `emoji_events` | Achievements | Scoreboard | Unlocked achievements |
| `auto_awesome` | Synergies | Scoreboard | Synergy indicators |
| `trending_up` | Progress metrics | Various | Improvement/growth |
| `star` | Ratings/quality | Results | Performance rating |
| `flag` | Mission status | MapView | Game completion |
| `schedule` | Time tracking | Games | Duration/timing |
| `account_circle` | User representation | Header | Player avatar |

---

## Game-Specific Icons

### Puzzle Game: "Säker Datasystem"

| Icon Name | Usage | Description |
|-----------|-------|-------------|
| `badge` | Person data type | Individual citizen data |
| `business` | Organization data | Company/organization data |
| `home` | Housing data | Property/address information |
| `health_and_safety` | Health data | Medical/welfare information |
| `landscape` | Geographic data | Land/property geographic data |
| `hub` | Ena-hub connection | Central data sharing platform |
| `share` | Data connections | Data flow visualization |
| `shield` | Security/firewall | Security protection |
| `update` | Modernization needed | System upgrade required |
| `verified` | Secure connection | Trusted/verified link |
| `support_agent` | Citizen services | Public service interface |
| `analytics` | Data analysis | Information processing |
| `construction` | System building | Infrastructure development |

### Welfare Game: "Välfärdens Dilemma"

| Icon Name | Usage | Description |
|-----------|-------|-------------|
| `elderly` | Arne character | 82-year-old care recipient |
| `family_restroom` | Karin character | Family member/daughter |
| `medical_services` | Lasse character | Healthcare/care worker |
| `favorite` | Staff wellbeing | Care worker satisfaction |
| `person` | Personal autonomy | Individual independence |
| `security` | Safety measures | Protection/monitoring |
| `home` | Living environment | Residence/care setting |
| `notifications` | Alert system | Emergency notifications |
| `gps_fixed` | Location tracking | Geographic monitoring |
| `health_and_safety` | Health monitoring | Medical surveillance |
| `balance` | Decision balance | Ethical considerations |
| `group` | Stakeholder meeting | Multiple participants |
| `psychology` | Emotional states | Character feelings |
| `handshake` | Consensus building | Agreement/compromise |

### Competence Game: "Kompetensresan"

| Icon Name | Usage | Description |
|-----------|-------|-------------|
| `book` | Basic competence | Fundamental digital skills |
| `psychology` | Broad competence | Cross-functional digital knowledge |
| `precision_manufacturing` | Specialist competence | Advanced technical expertise |
| `school` | Training programs | Educational activities |
| `work` | Workplace learning | On-job skill development |
| `group` | Team training | Collaborative learning |
| `computer` | Technical training | IT/digital tool training |
| `science` | Research & development | Innovation/experimentation |
| `business_center` | Corporate training | Business skill development |
| `card_giftcard` | Training budget | Financial resources |
| `event` | Time management | Schedule/calendar |
| `assignment` | Action cards | Training activities |
| `crisis_alert` | Event cards | Unexpected challenges |
| `trending_up` | Competence growth | Skill progression |

### Connectivity Game: "Konnektivitetsvakten"

| Icon Name | Usage | Description |
|-----------|-------|-------------|
| `cable` | Fiber optic | High-speed wired connection |
| `cell_tower` | 5G mast | Wireless communication tower |
| `satellite` | Satellite uplink | Backup/remote communication |
| `router` | Network equipment | Connectivity infrastructure |
| `signal_cellular_alt` | Signal strength | Connection quality |
| `cloud_sync` | Edge computing | Distributed processing |
| `device_hub` | Network hub | Central connection point |
| `storm` | Weather crisis | Natural disaster impact |
| `security` | Cyber threat | Digital security incident |
| `emergency` | Crisis response | Emergency management |
| `construction` | Infrastructure building | Development/installation |
| `engineering` | Technical repair | Maintenance/fixing |
| `timer` | Crisis countdown | Time pressure |
| `speed` | Performance metrics | System efficiency |
| `gpp_good` | System resilience | Robust/secure systems |

### Ecosystem Game: "Ekosystembyggaren"

| Icon Name | Usage | Description |
|-----------|-------|-------------|
| `rocket_launch` | Startup companies | New business ventures |
| `trending_up` | Growth companies | Scaling businesses |
| `domain` | Enterprise companies | Large corporations |
| `auto_awesome` | Unicorn companies | Billion-dollar valuations |
| `lightbulb` | Innovation metric | Creative/inventive capacity |
| `public` | Competitiveness | Global market position |
| `shield` | Cybersecurity | National security strength |
| `eco` | Sustainability | Environmental responsibility |
| `policy` | Government policies | Regulatory frameworks |
| `account_balance` | Government funding | Public investment |
| `handshake` | Public-private partnership | Collaboration |
| `science` | Research & development | Innovation infrastructure |
| `school` | Education initiatives | Skill development programs |
| `factory` | Manufacturing | Industrial capacity |

---

## Character Assets

### Welfare Game Characters

#### Arne (82-year-old care recipient)
- **Base Avatar**: Modified `elderly` icon
- **Emotional States**: 
  - Neutral: `elderly` (default gray)
  - Concerned: `elderly` with amber tint (#ED6C02)
  - Upset: `elderly` with red tint (#C62828)  
  - Satisfied: `elderly` with green tint (#2E7D32)
- **Format**: SVG with color variations
- **Size**: 48x48px standard, scalable

#### Karin (Family member)
- **Base Avatar**: Modified `family_restroom` icon
- **Emotional States**:
  - Neutral: Standard gray (#5A5A5A)
  - Worried: Amber (#ED6C02)
  - Desperate: Red (#C62828)
  - Relieved: Green (#2E7D32)
- **Format**: SVG with emotional color coding
- **Size**: 48x48px standard, scalable

#### Lasse (Care worker)
- **Base Avatar**: Modified `medical_services` icon  
- **Emotional States**:
  - Professional: Standard blue (#0288D1)
  - Stressed: Amber (#ED6C02)
  - Overwhelmed: Red (#C62828)
  - Supported: Green (#2E7D32)
- **Format**: SVG with professional styling
- **Size**: 48x48px standard, scalable

---

## Map Graphics

### Sweden Map Assets

#### Main Map Components
```
assets/images/maps/
├── sweden-outline.svg          # Main country outline
├── region-markers.svg          # Clickable game regions
├── region-overlays/            # Regional highlighting
│   ├── puzzle-region.svg       # Säker Datasystem area
│   ├── welfare-region.svg      # Välfärdens Dilemma area  
│   ├── competence-region.svg   # Kompetensresan area
│   ├── connectivity-region.svg # Konnektivitetsvakten area
│   └── ecosystem-region.svg    # Ekosystembyggaren area
└── progression-effects/        # Visual progress indicators
    ├── data-flows.svg          # Animated data connections
    ├── welfare-centers.svg     # Care facility indicators
    ├── education-hubs.svg      # Learning center markers
    ├── infrastructure-grid.svg # Network visualization
    └── innovation-nodes.svg    # Innovation ecosystem
```

#### Map Specifications
- **Base Map**: Simplified Sweden outline, recognizable silhouette
- **Color Scheme**: Matches design system (primary: #003D82)
- **Interactive Regions**: Hover effects, click animations
- **Progress Visualization**: Layered SVG animations for completion

### Regional Positioning
```javascript
const regionPositions = {
  "pussel-spel-datasystem": { x: 300, y: 200 },    // Central Sweden
  "valfards-dilemma": { x: 250, y: 150 },          // Stockholm region  
  "kompetensresan": { x: 200, y: 250 },            // West coast
  "konnektivitetsvakten": { x: 350, y: 180 },      // Norra Mälardalen
  "ekosystembyggaren": { x: 300, y: 100 }          // National scope
};
```

---

## UI Graphics & Decorations

### Background Elements
```
assets/images/backgrounds/
├── main-dashboard-bg.svg       # Subtle geometric pattern
├── onboarding-bg.svg          # Welcoming gradient
├── compass-bg.svg             # Technical/strategic theme
├── game-wrapper-bg.svg        # Neutral game container
└── finale-bg.svg              # Celebratory/achievement theme
```

### Progress Indicators
```
assets/images/ui/
├── progress-bars/             # Custom progress visualizations
│   ├── fl-score-meter.svg     # FL-poäng progress bar
│   ├── autonomy-meter.svg     # Welfare game metric
│   ├── security-meter.svg     # Security metric
│   └── competence-meter.svg   # Competence development
├── badges/                    # Achievement badges
│   ├── first-victory.svg      # First game completion
│   ├── consensus-builder.svg  # Welfare game consensus
│   ├── security-expert.svg    # Security specialization
│   └── synergy-master.svg     # All synergies unlocked
└── decorative/               # Visual enhancement elements
    ├── corner-ornaments.svg   # Card decorations
    ├── section-dividers.svg   # Content separation
    └── accent-lines.svg       # Subtle visual guides
```

---

## Audio Requirements

### UI Sound Effects

| File Name | Usage | Duration | Description |
|-----------|-------|----------|-------------|
| `click.mp3` | Button clicks | 0.1s | Subtle click sound |
| `success.mp3` | Positive actions | 0.3s | Achievement confirmation |
| `error.mp3` | Validation errors | 0.2s | Error notification |
| `notification.mp3` | Alerts/messages | 0.4s | Attention-getting tone |
| `modal-open.mp3` | Modal appearance | 0.2s | Smooth open sound |
| `modal-close.mp3` | Modal dismissal | 0.2s | Gentle close sound |
| `page-turn.mp3` | Navigation | 0.3s | Transition between views |
| `unlock.mp3` | Content unlocking | 0.5s | Achievement unlock |

### Game-Specific Audio

#### Puzzle Game Audio
```
assets/audio/puzzle/
├── connection-success.mp3      # Successful data connection
├── modernization-complete.mp3  # System upgrade finished  
├── security-alert.mp3          # Security warning
└── puzzle-complete.mp3         # Game completion fanfare
```

#### Welfare Game Audio  
```
assets/audio/welfare/
├── dialogue-advance.mp3        # Conversation progression
├── choice-select.mp3           # Decision selection
├── consensus-reached.mp3       # Successful agreement
└── relationship-improve.mp3    # Positive relationship change
```

#### Competence Game Audio
```
assets/audio/competence/
├── training-complete.mp3       # Skill development finished
├── budget-spent.mp3            # Resource allocation
├── event-trigger.mp3           # Random event occurrence  
└── competence-milestone.mp3    # Major competence gain
```

#### Connectivity Game Audio
```
assets/audio/connectivity/
├── infrastructure-build.mp3    # Construction sound
├── crisis-alert.mp3            # Emergency notification
├── system-repair.mp3           # Technical fix
└── resilience-achieved.mp3     # Crisis overcome
```

#### Ecosystem Game Audio
```
assets/audio/ecosystem/
├── policy-implement.mp3        # Government action
├── company-growth.mp3          # Business success
├── market-event.mp3            # Economic change
└── unicorn-created.mp3         # Major achievement
```

### Ambient Background Music

| File Name | Usage | Style | Loop |
|-----------|-------|-------|------|
| `main-ambient.mp3` | Dashboard/navigation | Calm, professional | Yes |
| `onboarding-warm.mp3` | Tutorial/welcome | Welcoming, optimistic | Yes |
| `puzzle-focused.mp3` | Technical challenges | Concentrated, steady | Yes |
| `welfare-empathetic.mp3` | Emotional scenarios | Warm, thoughtful | Yes |
| `competence-strategic.mp3` | Planning/development | Strategic, building | Yes |
| `connectivity-tense.mp3` | Crisis management | Escalating tension | Yes |
| `ecosystem-grand.mp3` | National scale | Inspiring, ambitious | Yes |
| `finale-triumphant.mp3` | Victory celebration | Celebratory, proud | No |

---

## Content Localization Assets

### Swedish UI Text (Structured for Translation)

```json
{
  "common": {
    "continue": "Fortsätt",
    "cancel": "Avbryt",
    "close": "Stäng",
    "back": "Tillbaka",
    "next": "Nästa",
    "finish": "Slutför",
    "retry": "Försök igen",
    "loading": "Laddar...",
    "saving": "Sparar...",
    "error": "Fel uppstod",
    "success": "Framgång!"
  },
  
  "navigation": {
    "dashboard": "Översikt",
    "compass": "Min Kompass",
    "achievements": "Utmärkelser",
    "settings": "Inställningar",
    "help": "Hjälp"
  },
  
  "dashboard": {
    "title": "Framtidsbygget",
    "subtitle": "Sveriges Digitala Strategiresan",
    "mission_report": "Uppdragsrapport",
    "total_score": "Total FL-poäng",
    "completed_missions": "Avklarade Uppdrag",
    "unlocked_synergies": "Upplåsta Synergier",
    "digital_compass": "Digitala Kompassen"
  },
  
  "games": {
    "puzzle": {
      "title": "Säker Datasystem",
      "description": "Bygg en säker och sammanhållen digital infrastruktur"
    },
    "welfare": {
      "title": "Välfärdens Dilemma", 
      "description": "Navigera etiska val i digitalisering av välfärdstjänster"
    },
    "competence": {
      "title": "Kompetensresan",
      "description": "Utveckla organisationens digitala kompetens"
    },
    "connectivity": {
      "title": "Konnektivitetsvakten",
      "description": "Bygg och försvara kritisk digital infrastruktur"  
    },
    "ecosystem": {
      "title": "Ekosystembyggaren",
      "description": "Bygg Sveriges digitala innovationsekosystem"
    }
  },
  
  "results": {
    "mission_complete": "Uppdrag Slutfört!",
    "mission_failed": "Uppdraget Kräver Mer Arbete",
    "score_awarded": "Poäng Tilldelade",
    "new_achievement": "Ny Utmärkelse!",
    "synergy_unlocked": "Synergi Upplåst!",
    "compass_updated": "Kompass Uppdaterad"
  },
  
  "finale": {
    "title": "Årsrapporten till Nationen",
    "subtitle": "Din Digitala Strategiresan Slutförd",
    "leadership_profile": "Din Ledarskapsprofil",
    "strategic_impact": "Ditt Strategiska Avtryck",
    "play_again": "Spela Igen"
  }
}
```

---

## Asset Loading Strategy

### Asset Manifests

#### Core Assets (Load First)
```json
{
  "core": [
    { "type": "icon", "name": "close", "url": "/assets/icons/close.svg" },
    { "type": "icon", "name": "check_circle", "url": "/assets/icons/check_circle.svg" },
    { "type": "audio", "name": "click", "url": "/assets/audio/ui/click.mp3" },
    { "type": "image", "name": "sweden_map", "url": "/assets/images/maps/sweden-outline.svg" }
  ]
}
```

#### Game-Specific Assets (Lazy Load)
```json
{
  "puzzle-game": [
    { "type": "icon", "name": "badge", "url": "/assets/icons/badge.svg" },
    { "type": "icon", "name": "business", "url": "/assets/icons/business.svg" },
    { "type": "audio", "name": "connection_success", "url": "/assets/audio/puzzle/connection-success.mp3" }
  ],
  
  "welfare-game": [
    { "type": "icon", "name": "elderly", "url": "/assets/icons/elderly.svg" },
    { "type": "icon", "name": "family_restroom", "url": "/assets/icons/family_restroom.svg" },
    { "type": "audio", "name": "dialogue_advance", "url": "/assets/audio/welfare/dialogue-advance.mp3" }
  ]
}
```

### Progressive Loading Strategy

1. **Initial Load** (< 500KB): Core UI assets, essential icons, main background
2. **Dashboard Load** (< 300KB): Map graphics, navigation icons, ambient audio
3. **Game Load** (< 200KB per game): Game-specific assets loaded on demand
4. **Audio Streaming**: Background music loaded asynchronously

---

## Development & Production Optimization

### Asset Processing Pipeline

```bash
# SVG Optimization
npm run optimize:svg
# - Remove unnecessary metadata
# - Optimize paths and shapes  
# - Compress file size

# Audio Compression
npm run optimize:audio
# - Convert to web-optimized MP3
# - Normalize volume levels
# - Remove silence/metadata

# Image Processing  
npm run optimize:images
# - Generate WebP variants
# - Create responsive sizes
# - Optimize compression
```

### Asset Validation Checklist

- [ ] All icons use Material Symbols specification
- [ ] SVG files are optimized and compressed  
- [ ] Audio files are web-ready (< 100KB each)
- [ ] Character avatars support emotional states
- [ ] Map graphics align with game regions
- [ ] Localization text files are complete
- [ ] Asset manifests include all required files
- [ ] Total initial bundle < 2MB
- [ ] Progressive loading implemented
- [ ] Fallback assets defined for errors

---

## Accessibility Considerations

### Visual Assets
- **High Contrast**: All icons work with high contrast mode
- **Color Blind Support**: No color-only information conveyance
- **Scalability**: SVG assets scale to 200% without quality loss
- **Alternative Text**: All decorative images have proper descriptions

### Audio Assets
- **Volume Normalization**: Consistent audio levels across all files
- **Optional Audio**: All audio effects have visual alternatives
- **Hearing Impaired**: Visual feedback for all audio cues
- **Audio Controls**: User can disable/adjust all sound effects

---

**Asset Implementation Ready:** All assets are specified with clear requirements, optimization guidelines, and implementation instructions for immediate development use.