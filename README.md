# SharkHabits V3 — Root Main

Cette variante est conçue pour que **tous les fichiers soient directement à la racine de la branche `main`**, sans dossier `assets`, `images`, `css`, `js`, etc.

## Structure exacte du dépôt

```text
main
├── index.html
├── app.js
├── style.css
├── manifest.json
├── sw.js
├── icon.svg
└── README.md
```

Les références utilisées sont donc simplement :

- `style.css`
- `app.js`
- `manifest.json`
- `icon.svg`
- `sw.js`

Aucun chemin `assets/...`, `images/...` ou autre sous-dossier n'est utilisé.

## GitHub Pages

Dans GitHub :

1. Décompresser le ZIP.
2. Mettre **le contenu du ZIP**, et non le dossier lui-même, directement à la racine de `main`.
3. Commit.
4. Settings → Pages.
5. Deploy from a branch → `main` → `/ (root)`.
6. Attendre le nouveau déploiement puis recharger la PWA.

Le cache du service worker a été changé en `sharkhabits-v3.0.1-root-main` afin d'éviter que l'ancienne V3 reste servie.

## Important

Les requins affichés dans cette version sont actuellement des caractères/emoji Unicode intégrés à l'interface : ils ne dépendent donc d'aucun fichier image externe. L'icône PWA `icon.svg`, elle, est recherchée directement à la racine.
