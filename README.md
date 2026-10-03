# SharkHabits V11.0 — Progress Fix

V11 corrige le calcul des objectifs chiffrés lorsque la valeur de départ est 0.

Exemple :
- objectif hebdomadaire : 10 km
- réalisé : 3,5 km
- progression attendue : 35 %

Le bug venait d'un fallback JavaScript avec `||` : une valeur de départ égale à 0 était considérée comme absente.
V11 utilise une gestion explicite du zéro et conserve les données V10.

Version visible : V11.0
Cache : sharkhabits-v11.0.0-progress-fix
