# SharkHabits V2

PWA mobile-first de suivi d'habitudes et d'objectifs, gamifiée autour d'un requin.

## Installation sur GitHub Pages
1. Décompressez le ZIP.
2. Déposez **tous les fichiers à la racine** de votre dépôt GitHub (index.html, app.js, style.css, manifest.json, sw.js, icon.svg).
3. Commit / push sur `main`.
4. GitHub > Settings > Pages > Deploy from a branch > `main` > `/ (root)` > Save.
5. Ouvrez l'URL GitHub Pages. Sur iPhone : Partager > Sur l'écran d'accueil.

## Important lors d'une mise à jour
Le service worker utilise un numéro de cache (`sharkhabits-v2.1`). Si une future version semble rester en cache, augmentez ce numéro dans `sw.js`, puis rechargez la page.

## Fonctionnalités V2
- Vue Aujourd'hui
- Planning hebdomadaire
- Objectifs renouvelables jour/semaine/mois
- Habitudes à fréquence
- Objectifs longue durée
- Mesures évolutives
- Une activité peut alimenter un objectif long via `source`
- Historique conservé au renouvellement de période
- Graphiques progression réelle / cible
- XP + dents
- Collection de requins
- Succès
- PWA hors ligne
- Sauvegarde locale via localStorage

Les données restent sur l'appareil/navigateur dans cette version.
