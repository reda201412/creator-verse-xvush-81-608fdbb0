# Enhanced Video Uploader

Un composant d'upload de vidéo avancé et personnalisable pour l'application XDose, offrant une expérience utilisateur fluide et moderne.

## Fonctionnalités

- 🚀 Téléversement de fichiers avec glisser-déposer
- 🎭 Génération automatique de miniatures
- 🔒 Protection TRIPLE SHIELD (chiffrement, filigrane, DRM)
- 💰 Options de monétisation intégrées
- 📝 Saisie des métadonnées avancées
- 📱 Interface réactive et accessible
- 🎨 Thème sombre/clair natif
- 🔄 Suivi de progression en temps réel
- 🛡️ Validation des fichiers côté client

## Installation

Assurez-vous d'avoir installé les dépendances requises :

```bash
npm install react-dropzone @hookform/resolvers zod sonner
```

## Utilisation

```tsx
import { EnhancedVideoUploader } from '@/components/creator/EnhancedUploader';

function MyComponent() {
  const handleUploadComplete = (metadata) => {
    console.log('Upload terminé avec les métadonnées :', metadata);
    // Rediriger ou mettre à jour l'état de l'application
  };

  return (
    <div>
      <EnhancedVideoUploader 
        onUploadComplete={handleUploadComplete}
        isCreator={true}
        className="ma-classe-personnalisee"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `onUploadComplete` | `(metadata?: any) => void` | ✅ | Fonction appelée lorsque le téléversement est terminé |
| `isCreator` | `boolean` | ✅ | Indique si l'utilisateur actuel est un créateur |
| `className` | `string` | ❌ | Classes CSS supplémentaires pour le conteneur |

## État du composant

Le composant gère plusieurs états d'upload :

1. **Idle/Selecting** : En attente de sélection de fichier
2. **Uploading** : Téléversement en cours
3. **Processing** : Traitement de la vidéo
4. **Metadata** : Saisie des métadonnées
5. **Complete/Error** : Finalisation ou erreur

## Personnalisation

### Thèmes

Le composant utilise les variables CSS de votre thème. Assurez-vous d'avoir défini les couleurs et espacements dans votre fichier `tailwind.config.js`.

### Traductions

Les textes sont en français par défaut. Pour les modifier, éditez directement les composants ou utilisez un système de traduction comme `next-intl` ou `i18next`.

## Sécurité

- Validation des types de fichiers côté client et serveur
- Limitation de taille des fichiers
- Protection contre les téléversements malveillants
- Chiffrement des fichiers sensibles

## Performance

- Chargement paresseux des composants lourds
- Optimisation des images et vidéos
- Mise en cache intelligente

## Développement

Pour contribuer au composant :

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Lancez le serveur de développement : `npm run dev`

## Licence

MIT

---

Développé avec ❤️ par l'équipe XDose
