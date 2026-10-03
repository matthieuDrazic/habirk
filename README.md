# SharkHabits V13.2 — Navigation indépendante

La cause du blocage était architecturale : la navigation était branchée dans `bind()`, appelé seulement à la fin de `render()`.
Si une erreur survenait pendant le rendu d'une carte, des stats ou du suivi, `bind()` n'était jamais atteint et toute la barre devenait inerte.

V13.2 installe la navigation AVANT `render()` et la rend totalement indépendante du rendu des pages.
Le clic change directement la section `.page.active`; aucune fonction de stats/suivi/boutique n'est nécessaire pour changer d'onglet.
Un `try/catch` autour du rendu empêche aussi une erreur secondaire de condamner la navigation.
Cache : sharkhabits-v13.2.0-independent-nav.
