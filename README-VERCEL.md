# Configuration du Backend Vercel avec Mux

Ce document explique comment configurer et déployer le backend Vercel pour gérer les uploads de vidéos via Mux.

## Prérequis

1. Un compte [Vercel](https://vercel.com)
2. Un compte [Mux](https://mux.com) avec accès à l'API
3. Un projet Firebase avec Firebase Authentication et Firestore

## Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"

# Mux
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret
MUX_WEBHOOK_SECRET=your-mux-webhook-secret

# Vercel
VERCEL_URL=localhost:3000

# Mode (development/production)
NODE_ENV=development
```

Dans le tableau de bord Vercel, ajoutez également ces variables d'environnement.

## Obtenir les Clés d'API Mux

1. Connectez-vous à votre [tableau de bord Mux](https://dashboard.mux.com)
2. Allez dans Settings > Access Tokens
3. Créez un nouveau token avec les autorisations Video et Full Access
4. Notez le Token ID et le Token Secret
5. Allez dans Settings > Webhooks
6. Créez un nouveau webhook pour l'événement "video.asset.ready" pointant vers votre URL Vercel `/api/mux/webhook`
7. Copiez le secret du webhook

## Obtenir les Informations de Compte de Service Firebase

1. Dans la [console Firebase](https://console.firebase.google.com), accédez à votre projet
2. Allez dans Paramètres du projet > Comptes de service
3. Générez une nouvelle clé privée pour Firebase Admin SDK
4. Utilisez les informations du fichier JSON généré pour remplir les variables d'environnement Firebase

## Déploiement sur Vercel

1. Installez l'interface de ligne de commande Vercel :
   ```
   npm install -g vercel
   ```

2. Connectez-vous à votre compte Vercel :
   ```
   vercel login
   ```

3. Déployez le projet :
   ```
   vercel
   ```

4. Pour déployer en production :
   ```
   vercel --prod
   ```

## Structure du Backend

Le backend expose les endpoints suivants :

- **POST /api/mux/create-upload** : Génère une URL d'upload direct Mux
- **GET /api/mux/assets** : Liste tous les assets vidéo
- **GET /api/mux/assets?id=XXX** : Récupère les informations d'un asset spécifique
- **DELETE /api/mux/assets?id=XXX** : Supprime un asset
- **POST /api/mux/webhook** : Endpoint pour les webhooks Mux

## Sécurité

Tous les endpoints sont protégés par l'authentification Firebase et ne sont accessibles qu'aux utilisateurs connectés. 
Les endpoints de création et de gestion des assets sont réservés aux utilisateurs ayant le rôle "creator".

## Utilisation dans le Frontend

Le service `VideoService` dans le frontend expose des méthodes pour interagir avec ces endpoints :

```typescript
import { VideoService } from '@/services/videoService';

// Créer une URL d'upload
const { id, url } = await VideoService.createUploadUrl();

// Récupérer un asset
const asset = await VideoService.getAsset(assetId);

// Récupérer la liste des assets
const { data: assets } = await VideoService.listAssets(1, 10);

// Supprimer un asset
await VideoService.deleteAsset(assetId);

// Générer une URL de lecture
const playbackUrl = VideoService.getPlaybackUrl(playbackId);

// Générer une URL de miniature
const thumbnailUrl = VideoService.getThumbnailUrl(playbackId);
```

## Résolution des Problèmes

### Les uploads échouent
- Vérifiez que les clés d'API Mux sont correctes
- Assurez-vous que l'utilisateur a le rôle "creator"
- Vérifiez les logs dans la console Vercel

### Les webhooks ne fonctionnent pas
- Vérifiez que l'URL du webhook est correcte et accessible publiquement
- Vérifiez que le secret du webhook est correctement configuré
- Examinez les logs Vercel pour voir si les webhooks sont reçus

### Problèmes d'authentification
- Assurez-vous que les informations du compte de service Firebase sont correctes
- Vérifiez que les tokens Firebase sont correctement envoyés depuis le frontend 