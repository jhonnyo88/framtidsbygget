# Master UX/UI Specifikation: Framtidsbygget

**Version:** 1.1 (Reviderad för maximal tydlighet)  
**Status:** Levande Dokument  
**Syfte:** Att fungera som den enda, definitiva källan för hela spelets visuella och interaktiva design. Dokumentet är skrivet för att vara en direkt instruktion till Systemarkitekten och AI-utvecklaren, med tydlig spårbarhet till speldesignerns GDD:er.

---

## Global Designgrund (Design System)

Denna del definierar de **fundamentala visuella och interaktiva byggstenarna** för hela applikationen "Framtidsbygget". Allt som designas i senare delar måste följa de principer och specifikationer som fastställs här. Detta säkerställer en konsekvent, professionell och implementation-klar användarupplevelse.

### Färgpalett

**Implementation:** Alla färger ska definieras som CSS Custom Properties i en global stylesheet (t.ex. `:root`) för enkel och konsekvent användning.

**Användning:** Primära och funktionella färger utgör basen. Tematiska färger ska användas för att färga unika, interaktiva element inom ett minispel (t.ex. fyllnadsfärgen på mätare, aktiva val i dialoger) för att ge det en egen identitet.

| Kategori | Variabelnamn | Hex-kod |
|----------|--------------|---------|
| **Primär (Ramverk)** | `--color-brand-primary` | #003D82 |
| | `--color-brand-secondary` | #E6F0FF |
| | `--color-ui-background` | #F7F9FC |
| | `--color-ui-card` | #FFFFFF |
| | `--color-text-primary` | #1A1A1A |
| | `--color-text-secondary` | #5A5A5A |
| **Funktionell (UI)** | `--color-state-success` | #2E7D32 |
| | `--color-state-warning` | #ED6C02 |
| | `--color-state-danger` | #C62828 |
| | `--color-state-info` | #0288D1 |
| **Tematisk (Minispel)** | `--color-accent-warm` | #FF8F00 |
| | `--color-accent-cool` | #0097A7 |
| | `--color-accent-innovation` | #8E24AA |

### Typografi

Typsnittet är **"Work Sans"**. Radhöjder (`line-height`) är nu specificerade för att säkerställa vertikal rytm och läsbarhet.

| Roll (CSS-klass) | Font-size (rem) | Font-weight | Line-height |
|------------------|------------------|-------------|-------------|
| `heading-xl` | 2.5rem (40px) | 700 (Bold) | 1.2 |
| `heading-l` | 2rem (32px) | 700 (Bold) | 1.2 |
| `heading-m` | 1.5rem (24px) | 600 (SemiBold) | 1.3 |
| `body-l` | 1.125rem (18px) | 400 (Regular) | 1.6 |
| `body-m` | 1rem (16px) | 400 (Regular) | 1.5 |
| `label` | 0.875rem (14px) | 500 (Medium) | 1.4 |

### Ikonografi

Biblioteket är **Google Material Symbols** i stilen "Outlined".

**Princip:** Välj alltid den mest bokstavliga och igenännbara ikonen för en funktion. Undvik abstrakta metaforer.

**Avatar-implementation:** För karaktärer i "Välfärdens Dilemma" ska komponenten `CharacterAvatar` skapas. Den renderar en `<span>` med ikonen `account_circle`. Ikonens färg och storlek är konstant, men `<span>`:ens bakgrundsfärg ska dynamiskt ändras baserat på karaktärens sinnestämning (`var(--color-accent-warm)` för neutral, `var(--color-state-danger)` för arg, etc.).

### Mellanrum & Layout (Spacing)

Ett **konsekvent mellanrumssystem** är avgörande. Använd CSS Custom Properties för att definiera en skala. All margin och padding ska använda dessa variabler.

```css
--space-xs: 4px
--space-s: 8px
--space-m: 16px
--space-l: 24px
--space-xl: 32px
--space-xxl: 48px
```

**Exempel:** En `Card`-komponents inre padding ska vara `var(--space-l)`. Mellanrummet mellan två knappar ska vara `var(--space-m)`.

### Kärnkomponenter (med interaktiva tillstånd)

#### Knappar (`<Button>`)

**Grundstilar:**
```css
padding: var(--space-s) var(--space-l)
border-radius: var(--space-s)
font-size: 1rem
font-weight: 500
transition: all 0.2s ease-in-out
cursor: pointer
```

**Tillstånd (states):**
- **`:hover`:** `filter: brightness(1.1)` (Ljusare). `box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1)`
- **`:active`:** `filter: brightness(0.9)` (Mörkare). `transform: scale(0.98)`
- **`:disabled`:** `background-color: #BDBDBD`, `color: #757575`, `cursor: not-allowed`

#### Kort (`<Card>`)

**Grundstilar:**
```css
background-color: var(--color-ui-card)
border-radius: 12px
border: 1px solid #EAECEF
box-shadow: 0px 4px 12px rgba(0, 61, 130, 0.05)
padding: var(--space-l)
```

**Interaktivt Kort** (t.ex. valbara kort i "Kompetensresan"):
- **Grund:** `transition: all 0.2s ease-in-out`
- **`:hover`:** `transform: translateY(-4px)`, `box-shadow: 0px 8px 16px rgba(0, 61, 130, 0.1)`
- **`.is-selected` (CSS-klass):** `border-color: var(--color-brand-primary)`, `box-shadow: 0px 8px 16px rgba(0, 61, 130, 0.1)`

#### Mätare (`<Meter>`)

**Komponentstruktur:** En yttre `<div>` (Track) och en inre `<div>` (Fill).

- **Track:** `height: 16px`, `border-radius: 8px`, `background-color: var(--color-brand-secondary)`
- **Fill:** `height: 100%`, `border-radius: 8px`. `width` styrs av en prop (t.ex. 75%). `transition: width 0.5s ease-out`
- **Textvärde:** En `<span>`-tagg ska positioneras absolut inuti komponenten för att visa det numeriska värdet (t.ex. "75%")

---

## Ramverkets Komponenter

Denna del beskriver designen för de **övergripande komponenterna** som utgör spelets "skal". Dessa komponenter hanterar den globala spelarresan, progressionen och navigeringen mellan minispelen.