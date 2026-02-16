# Kontinuumsmechanik: Dehnung & Konfigurationen

## Referenz- vs. Momentankonfiguration

Die Verschiebung $\mathbf{u}$ ist die Differenz zwischen der aktuellen Position $\mathbf{x}$ und der ursprünglichen Position $\underline{\bar{\mathbf{X}}}$:

$$
\mathbf{u} = \mathbf{x} - \underline{\bar{\mathbf{X}}}
$$

```tikz
\usetikzlibrary{arrows.meta, patterns, calc, decorations.pathreplacing}
\begin{document}
\begin{tikzpicture}[>=Latex, scale=1.5, font=\sffamily]

% --- Referenzkonfiguration (Oben) ---
\node[anchor=west, blue!60!black] at (-1, 2.8) {\textbf{Referenzkonfiguration}};

% Wand
\draw[thick] (0, 1.2) -- (0, 2.4);
\fill[pattern=north east lines] (-0.2, 1.2) rectangle (0, 2.4);

% Balken (unbelastet)
\draw[thick, fill=gray!10] (0, 1.5) rectangle (5, 2.1);

% Element dX
\draw[thick, fill=blue!10] (2.0, 1.5) rectangle (3.0, 2.1);
\draw[|->|, thick, blue!60!black] (2.0, 2.3) -- (3.0, 2.3) node[midway, above] {$d\underline{\bar{\mathbf{X}}}$};

% Vektor X (Position)
\draw[->, gray] (0, 1.3) -- (2.0, 1.3) node[midway, below] {$\underline{\bar{\mathbf{X}}}$};


% --- Momentankonfiguration (Unten) ---
\node[anchor=west, red!60!black] at (-1, 0.8) {\textbf{Momentankonfiguration}};

% Wand
\draw[thick] (0, -0.8) -- (0, 0.4);
\fill[pattern=north east lines] (-0.2, -0.8) rectangle (0, 0.4);

% Balken (belastet & länger)
\draw[thick, fill=gray!10] (0, -0.5) rectangle (6.5, 0.1);

% Element dx (gestreckt & verschoben)
\draw[thick, fill=red!10] (3.5, -0.5) rectangle (5.0, 0.1);
\draw[|->|, thick, red!60!black] (3.5, 0.3) -- (5.0, 0.3) node[midway, above] {$d\mathbf{x}$};

% Vektor x (Position)
\draw[->, gray] (0, -0.7) -- (3.5, -0.7) node[midway, below] {$\mathbf{x}$};

% Projektionslinien
\draw[dashed, gray!50] (2.0, 1.5) -- (3.5, 0.1);
\draw[dashed, gray!50] (3.0, 1.5) -- (5.0, 0.1);

\end{tikzpicture}
\end{document}
```

Wir betrachten nun isoliert die Vektoren des differentiellen Elements, um die Dehnung zu definieren. Dabei legen wir die Startpunkte übereinander (Parallelverschiebung), da uns die absolute Position für die Dehnung egal ist.

```tikz
\usetikzlibrary{arrows.meta, decorations.pathreplacing}
\begin{document}
\begin{tikzpicture}[>=Latex, scale=1.5, font=\sffamily]

\node[anchor=west] at (0, 1.0) {\large \textbf{Projizierte Vektoren (Polarzerlegung)}};

% Gemeinsame Startlinie
\draw[thick] (1, -2.5) -- (1, 0.5); 
\node[anchor=north] at (1, -2.5) {\small Start};

% 1. Referenzvektor dX
\draw[->, thick, blue!60!black] (1, 0) -- (2.5, 0) node[midway, above] {$d\underline{\bar{\mathbf{X}}}$};
\draw[dashed, gray] (2.5, 0) -- (2.5, -2.0); 

% 2. Momentanvektor dx (Länger)
\draw[->, thick, red!60!black] (1, -1.5) -- (4.0, -1.5) node[midway, above] {$d\mathbf{x}$};

% 3. Differenzvektor (du parallel)
\draw[->, orange!80!black, thick] (2.5, -0.75) -- (4.0, -0.75) node[midway, above] {$d\mathbf{u}$};
\draw[dashed, gray] (4.0, -1.5) -- (4.0, -0.75);

% Klammer für die Verlängerung
\draw [decorate, decoration={brace,amplitude=5pt}]
(4.0, -1.7) -- (2.5, -1.7) node [black, midway, yshift=-15pt] 
{\footnotesize Verlängerung};

\end{tikzpicture}
\end{document}
```

> [!TIP] **Intuition: Punkt vs. Element**
> Warum fängt $d\underline{\bar{\mathbf{X}}}$ genau bei der Pfeilspitze von $\underline{\bar{\mathbf{X}}}$ an?
>
> * **$\underline{\bar{\mathbf{X}}}$ (Der Ort):** Das ist die **"Adresse"** des Teilchens im Raum.
> * **$d\underline{\bar{\mathbf{X}}}$ (Das Element):** Das ist der **"Weg zum Nachbarn"**.
>
> Der Vektor $d\underline{\bar{\mathbf{X}}}$ ist fest am Punkt $\underline{\bar{\mathbf{X}}}$ **verankert**. Er spannt die **lokale Umgebung** auf.
>
> **Physikalischer Hintergrund:**
> Nur in dieser winzigen (differentiellen) Umgebung ist die Welt **flach** (linear). Deshalb können wir hier lineare Algebra betreiben ($\mathbf{F} \cdot d\mathbf{X}$), selbst wenn sich der ganze Körper global krumm verformt.
### Definition der Dehnung $\varepsilon$

$$
\varepsilon = \frac{d\mathbf{u}}{d\underline{\bar{\mathbf{X}}}}
$$

> **Invarianz der Dehnung gegenüber Starrkörperbewegungen:**
> Die absolute Position im Raum ($\mathbf{x}$) spielt für die Materialbeanspruchung keine Rolle. Nur die relative Längenänderung (Streckung) erzeugt Spannungen