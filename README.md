# SharkHabits V4.1 — Correctif aquarium plein écran

## Correctif principal
Le panneau océan de l’accueil est maintenant explicitement interactif sur mobile/iPhone/PWA : clic, toucher (`pointerup`) et clavier ouvrent tous l’aquarium plein écran.

Depuis le plein écran :
- **Décorer** ouvre l’inventaire ;
- sélectionner un objet puis toucher l’eau le place ;
- sélectionner un objet déjà placé puis toucher ailleurs le déplace ;
- double-tap/double-clic le range ;
- **Annuler** revient au placement précédent ;
- **Terminer** sauvegarde et ferme le mode édition.

Le kit de départ, la boutique, les requins visibles avec cadenas, les objectifs, stats et expéditions sont conservés. Aucun boss.

## GitHub Pages
Tous les fichiers doivent rester directement à la racine de `main`. Le cache est maintenant `sharkhabits-v4.1.0-root-main` et le service worker demande explicitement sa mise à jour.
