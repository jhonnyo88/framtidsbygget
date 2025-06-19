Game Design Document: Krishanteringsspelet "Konnektivitetsvakten"
Version: 1.0 Status: Klar för teamgranskning & implementation Spelvärld: Konnektivitet
1. Projektöversikt & Vision
Denna spelmodul är ett dynamiskt nätverks- och krishanteringsspel. Spelaren får ansvar för att bygga ut och säkra den digitala infrastrukturen i en fiktiv svensk region, för att sedan försvara den mot en serie av eskalerande kriser.
Vision: Spelaren ska inte bara läsa orden robusthet, resiliens och redundans; de ska uppleva den adrenalinkick som uppstår när nätverket är under attack och sekunder räknas. Genom att framgångsrikt navigera kriserna ska spelaren få en djup, intuitiv förståelse för varför en proaktiv, säker och diversifierad infrastruktur är helt avgörande för ett fungerande samhälle.
2. Berättelse & Scenario
Som digital strateg blir du tillfälligt placerad vid "Nationellt Telesamverkanscenter". En serie ovanligt kraftiga stormar och oförklarliga störningar har börjat drabba region "Norra Mälardalen". Ditt uppdrag är tvådelat:
Fas 1: Bygg & Förstärk. Du får en initial budget för att bygga ut och förstärka regionens digitala infrastruktur för att möta strategins mål.
Fas 2: Hantera krisen. När du är klar med byggfasen börjar kriserna. Du måste i realtid hantera larm, reparera skador och omdirigera trafik för att minimera störningarna för samhällsviktiga funktioner.
3. Lärandemål (Härledda från Digitaliseringsstrategin)
Infrastruktur för hela landet: Förstå vikten av att bygga ut både fast (fiber) och mobil (5G) uppkoppling för att täcka behoven hos invånare, företag och samhällsfunktioner (Strategin, s. 44).
Robusthet mot fysiska påfrestningar: Praktiskt uppleva hur fysiska skydd (t.ex. förstärkta master, nedgrävda kablar) kan motstå skador från händelser som stormar och bränder (Strategin, s. 48).
Resiliens genom snabb återhämtning: Förstå vikten av att snabbt kunna reparera och återställa skadad infrastruktur för att minimera samhällspåverkan (Strategin, s. 48, 50).
Redundans och diversitet som nyckelstrategi: Inse att det mest effektiva försvaret är att ha alternativa vägar och tekniker (t.ex. både fiber och satellit) så att trafiken kan omdirigeras när en del av nätet slås ut (Strategin, s. 49).
Cybersäkerhet: Förstå att hoten inte bara är fysiska, utan att nätverket även måste skyddas mot digitala angrepp (Strategin, s. 47-48).
4. Pedagogisk Design & Strategikarta
Varje val och händelse i spelet är en direkt iscensättning av en princip från strategin.
Strategins Kärnprincip
Källhänvisning (Sida)
Översättning till Spelmekanik (Regel i spelet)
Syfte & Lärande
Utbyggnad för konkurrenskraft & hela landet
37, 39, 44
Fas 1 (Bygg): Spelaren använder en budget för att placera ut Fiber-noder, 5G-master och Satellit-uplinks på en regionkarta för att ansluta städer, landsbygd och industrier. Olika platser ger olika poäng (t.ex. ansluta ett sjukhus är värt mycket).
Konkretiserar behovet av en genomtänkt utbyggnadsstrategi. Spelaren måste prioritera vilka områden och funktioner som är viktigast att ansluta först.
Robusthet - att motstå påfrestningar
47, 48
Fas 1 (Bygg): Varje placerad enhet (t.ex. en 5G-mast) kan uppgraderas med "Robusthet" (t.ex. stormsäkring) för en extra kostnad. En robust enhet har lägre risk att skadas under kris-fasen.
Gör robusthet till en konkret investering. Spelaren måste välja: bygga mer, eller bygga starkare? Detta simulerar en verklig budgetavvägning.
Resiliens - att snabbt återhämta sig
48, 50
Fas 2 (Kris): När en enhet skadas måste spelaren skicka ut ett "Reparationsteam". Tiden det tar att reparera beror på hur långt teamet måste åka. Att ha team förutplacerade på strategiska platser (kostar extra) snabbar upp processen.
Lär ut vikten av beredskap och snabb återställningsförmåga. Det handlar inte bara om att förebygga skador, utan att ha en plan för när de oundvikligen inträffar.
Redundans & Diversitet - att ha en plan B
49
Fas 1 & 2: Om en stad har två oberoende anslutningsvägar (t.ex. både fiber från norr och fiber från söder, eller både fiber och en satellitlänk), kan trafiken omdirigeras automatiskt om den ena vägen slås ut. Detta förhindrar ett avbrott helt och hållet.
Detta är den viktigaste mekaniken. Spelaren lär sig genom att göra att den smartaste strategin är att bygga in alternativa vägar från början. Det är dyrare, men betalar sig tusenfalt under en kris.
Cybersäkerhet & skydd mot antagonistiska hot
47, 48, 51
Fas 2 (Kris): Ett "Händelsekort" kan vara en "Cyberattack". Då infekteras en nod och börjar sprida sig. Spelaren måste snabbt använda en "Säkerhetspatch" (en specialförmåga med nedkylningstid) för att isolera och rensa den infekterade noden.
Introducerar ett icke-fysiskt hot som kräver en annan typ av respons. Detta belyser att ett modernt nätverksförsvar måste vara mångfacetterat.

5. Spelmekanik & Gränssnitt
Spelbräde: En stiliserad karta över en region med städer, landsbygd, ett sjukhus, en industripark och ett vattenkraftverk.
Fas 1 - Byggfasen (turordningsbaserad):
Spelaren har ett antal "Byggpoäng" och en budget.
Man klickar på kartan för att placera ut infrastruktur (Fiber, Master, Satelliter) och drar kablar mellan dem.
Man kan klicka på en enhet för att uppgradera den med "Robusthet".
Fas 2 - Krisfasen (förenklad realtid):
Tiden börjar ticka. En serie "Händelsekort" dras automatiskt (t.ex. "Stormbyar i östra regionen!", "Misstänkt dataintrång vid Vattenkraftverket!").
Händelserna skadar noder (som blir röda och slutar fungera) eller initierar cyberattacker.
Spelaren måste klicka på skadade noder för att skicka reparationsteam, och på infekterade noder för att applicera säkerhetspatcher.
Ett "Samhälls-index" (0-100%) tickar sakta nedåt för varje sekund som en viktig funktion (som sjukhuset) är offline.
6. Vinst- & Förlustvillkor
Vinst: Spelaren överlever den 5 minuter långa krisfasen utan att "Samhälls-indexet" sjunker under 50%.
Bonuspoäng ges för hur högt indexet är vid slutet, hur snabbt man hanterade kriserna och hur mycket av ens redundanta nätverk som aktiverades framgångsrikt.
Förlust: "Samhälls-indexet" sjunker under 50%. Spelet avbryts och ett meddelande visas: "Störningarna blev för omfattande. Regionens vitala funktioner har slagits ut. En mer robust och redundant infrastruktur krävdes. Försök igen."
7. Tekniskt Kontrakt & Gränssnitt
Modulen implementeras som ConnectivityGameModule.jsx och använder GameCanvasWrapper och PixiJS.
Ingående Data (Props):
onGameComplete: Function
Utgående Händelser (Callback onGameComplete):
onGameComplete({ success: Boolean, score: Number, finalIndex: Number, ... })
8. Visuell Design & Ljud (Brief till Kreatörer)
Stil: Rent, modernt och informativt. Tänk ett kontrollrum på en ledningscentral eller ett strategispel som "Mini Motorways". Tydlig ikonografi är A och O.
Kartan: Stiliserad, inte realistisk. Tydliga symboler för sjukhus (kors), industri (kugghjul) etc.
Nätverket: Fiberkablar kan vara tjocka, pulserande linjer. 5G-master har en radieeffekt. När data flödar ska små partiklar animeras längs linjerna.
Kris-effekter: En storm kan visualiseras med svepande moln och blixtar. En cyberattack kan vara en röd, pulserande infektion som sprider sig mellan noder. En skadad nod blir röd och slutar pulsera.
Ljud:
Byggfas: Lugn, konstruktiv och hoppfull musik.
Krisfas: Musiken blir mer dramatisk och tempofylld. Varningsljud (sirener, larm) hörs när nya händelser inträffar. Ett bekräftande ljud när en reparation är klar. Ljudet av en sprakande elledning när en nod slås ut.
Vinstmusiken ska kännas som en lättnad och en seger – lugnet efter stormen.
