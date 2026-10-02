# SharkHabits V4 — Aquarium interactif

## Nouveautés
- Océan de l'accueil cliquable → aquarium plein écran.
- Mode décoration interactif.
- Placement libre des décorations par toucher/clic.
- Déplacement d'un objet déjà placé.
- Double-clic/double-tap sur un objet en édition pour le ranger.
- Inventaire et boutique marine.
- Kit de départ gratuit : algues, herbes, rochers, coraux et coquillages.
- Les décorations achetées vont dans l'inventaire.
- Les expéditions rapportent aussi des décorations.
- Niveau d'océan.
- Sharkdex : **tous les requins restent visibles même verrouillés** ; un cadenas est superposé.
- Aucun objectif ni activité précréé.
- Aucun boss.
- Export/import de sauvegarde.
- PWA hors ligne.

## Structure GitHub
Tous les fichiers sont directement à la racine de `main` :

```text
index.html
app.js
style.css
manifest.json
sw.js
icon.svg
README.md
```

Aucun dossier `assets`, `images`, `css` ou `js` n'est nécessaire. Tous les chemins de fichiers pointent directement vers la racine publiée.

## Déploiement
1. Décompresser le ZIP.
2. Copier **le contenu** à la racine de la branche `main`.
3. Commit / push.
4. GitHub → Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
5. Attendre le déploiement puis rouvrir/recharger la PWA.

Le cache V4 est `sharkhabits-v4.0.0-root-main`, distinct des versions précédentes.
