# Migration de Mapbox vers OpenStreetMap

## Changements effectués

Ce projet a été migré de Mapbox vers OpenStreetMap (OSM) avec l'API Nominatim pour le géocodage.

### Avantages de ce changement :

1. **Gratuit et open-source** : Plus de limitation d'API ou de coûts
2. **Respect de la vie privée** : Pas de tracking utilisateur
3. **Communauté** : Soutien du projet OpenStreetMap
4. **Données mondiales** : Couverture complète du monde

### Fichiers modifiés :

-   `lib/services/nominatim.service.ts` (nouveau) : Service de géocodage OSM
-   `components/LocationTextInput.tsx` : Migration vers Nominatim
-   `components/forms/JamForm.tsx` : Suppression des références Mapbox
-   `constants/config.ts` : Configuration OSM au lieu de Mapbox

### API utilisée :

**Nominatim** - Service de géocodage d'OpenStreetMap

-   URL: https://nominatim.openstreetmap.org
-   Documentation: https://nominatim.org/release-docs/develop/api/Search/
-   Gratuit et sans clé d'API requise
-   Limite de politesse : 1 requête par seconde recommandée

### Configuration :

Le fichier `constants/config.ts` contient maintenant :

```typescript
export const osmConfig = {
    nominatimUrl: 'https://nominatim.openstreetmap.org',
    userAgent: 'MyJam/1.0.0',
    defaultCountryCode: 'fr', // Filtrage par pays optionnel
};
```

### Utilisation :

Le composant `LocationTextInput` fonctionne exactement de la même manière, mais utilise maintenant Nominatim :

```typescript
<LocationTextInput
    placeholder="Enter location"
    onLocationSelect={(location) => {
        // location.latitude et location.longitude sont disponibles
    }}
    countryCode="fr" // Optionnel : limiter à un pays
/>
```

### Notes importantes :

1. **Respecter les limites d'usage** : Nominatim est un service gratuit, évitez les requêtes trop fréquentes
2. **User-Agent requis** : Le service nécessite un User-Agent pour identifier votre app
3. **Format des données** : Compatible avec l'interface existante de Mapbox

### Prochaines étapes :

-   Les cartes continuent d'utiliser `react-native-maps` (pas de changement)
-   Le géocodage utilise maintenant OSM/Nominatim (gratuit)
-   Possibilité d'ajouter un cache local pour optimiser les performances
