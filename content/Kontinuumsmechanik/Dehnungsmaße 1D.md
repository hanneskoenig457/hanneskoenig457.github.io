---
tags:
  - mechanik
  - kontinuumsmechanik
  - festigkeitslehre
  - numerik
aliases:
  - Hencky-Dehnung
  - Logarithmische Dehnung
  - Wahre Dehnung
created: 2023-10-27
status: permanent
---

# Dehnungsmaße: Technische vs. Wahre Dehnung
> [!info]- Tafelbild (Hier klicken zum Öffnen)
>![[Dehnungsmaße 1D.png]]
> 
  

> [!abstract] Zusammenfassung
> Dieses Dokument behandelt den Unterschied zwischen der **technischen Dehnung** (bezogen auf Ausgangslänge) und der **logarithmischen Hencky-Dehnung** (bezogen auf aktuelle Länge). Letztere ist essentiell für große Verformungen (*Large Strain*).
## 1. Grundlegende Betrachtungsweisen

In der Kontinuumsmechanik unterscheiden wir zwei Perspektiven:

* **[[Lagrange-Betrachtung]] (Materiell):**
    * Wir folgen dem materielle Punkt.
    * Standard in der Strukturmechanik / **[[FEM]]**.
    * Die Berechnung erfolgt meist über die Verschiebung $u$.
* **[[Euler-Betrachtung]] (Räumlich):**
    * Wir betrachten einen festen Punkt im Raum, durch den Materie fließt.
    * Standard in der Strömungsmechanik (**[[CFD]]**).

> [!note] Spannungsvektor
> $t = T \cdot n$
> (Spannungsvektor = Spannungstensor $\cdot$ Normalenvektor)

---

## 2. Wahre Spannung & Volumenkonstanz

Die **wahre Spannung** ($\sigma_{true}$) bezieht sich immer auf den *tatsächlichen, momentanen* Querschnitt, nicht auf den ursprünglichen.

$$
\sigma_{true} = \frac{F}{A_{true}}
$$

### Annahme: Volumenkonstanz
Bei plastischer Verformung ist das Material inkompressibel (Querkontraktionszahl $\nu = 0.5$).
$$
V_0 = V_{aktuell} \implies L_0 \cdot A_0 = L \cdot A_{true}
$$

Daraus folgt für den Zugversuch (wenn $L > L_0$):
* $A_{true} < A_0$
* $L$: Variable (aktuelle Länge)
* $L_0$: Konstante (Ausgangslänge)

---

## 3. Das Problem der linearen Dehnung

**Frage:** *Wieso ist die lineare 1D-Dehnung ein Problem?*

Die technische Dehnung $\varepsilon$ (Ingenieursdehnung) ist definiert als:
$$
\varepsilon = \frac{\Delta L}{L_0} = \frac{L - L_0}{L_0} = \frac{L}{L_0} - 1
$$

> [!fail] Das Problem
> Der Bezug auf die konstante **Ausgangslänge** $L_0$ führt bei großen Verformungen zu physikalischen Inkonsistenzen. Eine Stauchung von 50% ist physikalisch nicht dasselbe wie eine Dehnung von 50% in dieser Definition.

**Beispielrechnung:**
$$\frac{2m}{1m} - 1 = 1 \hat{=} 100\%$$

---

## 4. Die Lösung: Hencky-Dehnung (Logarithmische Dehnung)

Auch bekannt als *Reale Dehnung* oder *Umformgrad $\varphi$* (nach Ludwik).
Sie entsteht durch Integration über die **momentane Länge** $l$.

### Herleitung
$$
d\varepsilon_{ln} = \frac{dl}{l} \implies \varepsilon_{ln}(L) = \int_{L_0}^{L} \frac{1}{l} \, dl
$$

Das Integral gelöst:
$$
\begin{align}
\varepsilon_{ln} &= [\ln(l)]_{L_0}^{L} \\
&= \ln(L) - \ln(L_0) \\
&= \ln\left( \frac{L}{L_0} \right) \\
&= \ln\left( \frac{L_0 + \Delta L}{L_0} \right) \\
&= \ln(1 + \varepsilon)
\end{align}
$$

---

## 5. Vergleich & Differentialbeziehungen

### Vor- und Nachteile

| **Vorteile (Hencky)** | **Nachteile** |
| :--- | :--- |
| ✅ **Additiv** (Dehnungen können addiert werden) | ❌ **Aufwendig** zu berechnen (numerisch teurer) |
| ✅ **Symmetrisch** (Zug/Druck gleichwertig) | |

### Differentialbeziehung (1D)
Zusammenhang zwischen Verschiebung $u(x)$ und Dehnung:

$$
\varepsilon = u'(x) = \frac{du(x)}{dx}
$$

Integralbeweis (Homogene Dehnung):
$$
\int_{0}^{L_0} \varepsilon \, dx = \int_{0}^{L_0} u'(x) \, dx = [u(x)]_{0}^{L_0} = \Delta L
$$

---

## 6. Diagramm (TikZ Code)

```tikz
\usepackage{tikz}
\usetikzlibrary{decorations.pathmorphing}

\begin{document}

\begin{tikzpicture}[scale=1.5]
    % Achsen
    \draw[->] (0,0) -- (4,0) node[right] {$\varepsilon_{ln}$};
    \draw[->] (0,0) -- (0,3) node[above] {$\sigma_{true}$};

    % Kurve (Elastisch)
    \draw[thick] (0,0) -- (0.5, 1.0); 
    
    % Lüders (Zick-Zack mit Library)
    \draw[thick, decorate, decoration={zigzag, segment length=2mm, amplitude=0.5mm}] (0.5, 1.0) -- (1.0, 1.0);
    
    % Verfestigung
    \draw[thick] (1.0, 1.0) .. controls (2.0, 1.8) and (3.0, 2.2) .. (3.5, 2.5);

    % Beschriftung
    \node at (0.2, 1.5) [right] {\footnotesize Elastisch};
    \node at (2.5, 1.5) [right] {\footnotesize Verfestigung};
\end{tikzpicture}

\end{document}
```

