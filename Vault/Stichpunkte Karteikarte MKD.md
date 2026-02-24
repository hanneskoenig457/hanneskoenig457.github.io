### Folie 9 -- Reifenmodell TMeasy

- Wir verwenden TMeasy Version 5.3 nach Georg Rill -- ein semi-physikalisches Reifenmodell
- Semi-physikalisch heißt: Nicht rein empirisch wie Pacejka/Magic Formula, sondern physikalisch motivierte Parameter, die man auch ohne Prüfstandsdaten ingenieurmäßig schätzen kann
- Pro Kraftrichtung (längs/quer) braucht man 5 Kenngrößen bei 2 Referenzlasten -- also insgesamt 10 Werte -- und TMeasy interpoliert daraus für beliebige Radlasten
- Erstordnungsdynamik sorgt für numerische Stabilität, auch bei Stillstand -- wichtig, weil wir aus dem Stand beschleunigen
- Für MX-Reifen gab es keine Prüfstandsdaten, deshalb ingenieurmäßige Schätzung
- Wichtigste MX-Besonderheiten gegenüber Straßenreifen:
    - Niedriger Fülldruck 0,9 bar --> deutlich geringere Vertikalsteifigkeit (85/100 kN/m statt ~200 kN/m bei PKW)
    - Hohe Walkdämpfung durch Stollen: 800-1000 Ns/m
    - Reibbeiwert ca. 0,85/0,92 -- verdichteter Offroad-Boden
    - Schlupf am Kraftmaximum bei 0,20-0,22 -- doppelt so hoch wie Asphalt (~0,10), weil loser Untergrund
    - Rollwiderstand 0,025 statt 0,01 -- Stollen + Eindringen in Boden

---

### Folie 10 -- Shim-Stack-Dämpfercharakteristik

- Jetzt zum Kern unserer Parameterstudie: die Dämpfer
- Ein Shim-Stack-Dämpfer hat drei charakteristische Regimes:
    1. **Niedergeschwindigkeit** (unter 0,1 m/s): Shims sind noch geschlossen, hoher effektiver Dämpfungskoeffizient d_eff = F/v -- das ist das Stiction-Regime
    2. **Mittelbereich**: Shims biegen sich progressiv auf, d_eff fällt digressiv ab -- klassische Kennlinie eines Shim-Stack
    3. **Hochgeschwindigkeit** (über 1 m/s): Blow-off-Ventil öffnet, leichter progressiver Wiederanstieg -- die Kraft steigt aber weiterhin monoton mit der Geschwindigkeit
- Rechts seht ihr eine schematische Darstellung aus dem Shim ReStackor Tool
- Wir vergleichen drei Setups bei identischen Federn:
    - **Standard**: Seriennahe Abstimmung, moderate Zug-/Druckstufen-Asymmetrie
    - **soft-D**: Druckstufe halbiert, Zugstufe 25% weicher -- Ziel: freiere Geländefolge des Rades
    - **xsoft-D**: Druckstufe nochmals um ein Drittel reduziert gegenüber soft-D, Zugstufe identisch zu soft-D -- maximale Radführung, Stabilität wird geopfert
- Wichtig: soft-D und xsoft-D haben die gleiche Zugstufe -- damit isolieren wir den Einfluss der Druckstufe als einzige Variable

---

### Folie 11 -- Federkennlinien und Baseline-Dämpfer (Bild)

- Hier sehen wir die Feder- und Dämpferkennlinien des Standard-Setups
- Links die Federn, rechts die Dämpfer
- Die graue gestrichelte Linie ist jeweils die lineare Referenz
- Man sieht die leicht progressive Feder und die typische nichtlineare, asymmetrische Dämpferkennlinie
- Asymmetrisch heißt: Zugstufe erzeugt mehr Kraft als Druckstufe -- das ist bei MX-Dämpfern Standard

---

### Folie 12 -- Federn und Dämpfer Details

- Die Federn sind progressiv modelliert: 3 Stützstellen mit kubischem Spline in SIMPACK
- Vorne: nominell 9,4 kN/m, steigt auf 11,3 kN/m am Anschlag bei 310 mm Hub
- Hinten: 55 kN/m, steigt auf 75 kN/m bei 100 mm Hub
- Progressiv ist gewollt: weiche Anfangsrate für Ansprechen auf kleine Unebenheiten, steigende Rate verhindert Durchschlagen
- Die Dämpfer sind stückweise linear modelliert -- bewusst kein kubischer Spline, um Überschwinger auf den asymmetrischen Kennlinien zu vermeiden
- Kennlinien basieren auf Shim ReStackor -- das ist ein Berechnungstool für Shim-Stack-Konfigurationen
- Federn sind bei allen drei Setups identisch -- nur die Dämpferkennlinie variiert

---

### Folie 19 -- Zusammenfassung

- Die Simulation zeigt qualitativ plausibles Fahrwerksverhalten
- Kernaussage: Weichere Druckstufe führt zu besserer Traktion und mehr zurückgelegter Strecke
- xsoft-D war das beste Setup: plus 9,2 Meter gegenüber Standard in 25 Sekunden, und kürzeste Bodenkontaktverlustzeit von 5,65 Sekunden
- Der Zusammenhang ist konsistent: weniger Kontaktverlust bedeutet mehr Traktion bedeutet mehr Vortrieb
- Aber ehrlich die Modellgrenzen benennen:
    - Kein Getriebemodell -- das eingeprägte Drehmoment reagiert nicht auf Fahrwerksdynamik
    - Rein 2D-Sinusgelände -- periodisch, begünstigt Resonanzeffekte, kein realistisches Gelände
    - Fahrer ist eine starre Masse -- in Wirklichkeit absorbiert der Fahrer aktiv Energie, gerade auf Whoops
    - Kennlinien geschätzt, nicht gemessen -- kein Prüfstand, Shim ReStackor als Grundlage
- Fazit: Die Rangfolge ist physikalisch plausibel, aber die quantitativen Unterschiede (~2%) sind mit Vorsicht zu interpretieren

---

### Folie 20 -- Vielen Dank / Fragen

- Vielen Dank für die Aufmerksamkeit
- Bei Fragen z.B. vorbereitet sein auf:
    - "Warum kein 3D-Modell?" -- Fokus auf Fahrwerksverhalten in Längsebene, Querneigung und Kurvenfahrt bewusst ausgeklammert, um Komplexität zu reduzieren
    - "Warum TMeasy und nicht Pacejka?" -- TMeasy erlaubt Parameterschätzung ohne Prüfstandsdaten, Pacejka braucht gemessene Koeffizienten
    - "Wie realistisch sind die 2% Unterschied?" -- Qualitative Rangfolge belastbar, quantitativ mit Vorsicht wegen Modellvereinfachungen
    - "Warum kein Firm-rebound / Packing?" -- Falls die Frage kommt: Haben wir rausgenommen, aber Packing-Effekt ist bekannt -- langsame Zugstufe lässt Dämpfer einpacken, Normalkraftspitzen bis 10 kN