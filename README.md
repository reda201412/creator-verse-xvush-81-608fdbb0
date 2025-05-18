# CreatorVerse - Plateforme de contenu vidéo

## Configuration de la base de données

### Prérequis

- Node.js 16+
- PostgreSQL 13+
- Compte [NEON](https://neon.tech/) (pour la base de données serverless)

### Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration de la base de données NEON
VITE_NEON_DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
NEXT_PUBLIC_NEON_DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Configuration MUX
NEXT_PUBLIC_MUX_TOKEN_ID=votre_token_id
MUX_TOKEN_SECRET=votre_token_secret
NEXT_PUBLIC_MUX_UPLOAD_ENDPOINT=/api/mux/upload
```

### Initialisation de la base de données

1. **Créer la table des vidéos** :
   ```bash
   npm run db:init
   ```
   Ce script va :
   - Tester la connexion à la base de données
   - Créer la table `videos` si elle n'existe pas
   - Afficher le nombre d'enregistrements existants

2. **Exécuter les migrations** :
   ```bash
   npm run db:migrate
   ```
   Ce script va exécuter toutes les migrations SQL du dossier `migrations/` qui n'ont pas encore été appliquées.

3. **Vérifier l'état des migrations** :
   ```bash
   npm run db:status
   ```
   Affiche la liste des migrations avec leur statut (appliquées ou en attente).

## Structure de la base de données

### Table `videos`

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique |
| user_id | TEXT | ID de l'utilisateur |
| title | TEXT | Titre de la vidéo |
| description | TEXT | Description |
| mux_asset_id | TEXT | ID de l'asset MUX |
| mux_playback_id | TEXT | ID de lecture MUX |
| mux_upload_id | TEXT | ID d'upload MUX |
| thumbnail_url | TEXT | URL de la miniature |
| duration | INTEGER | Durée en secondes |
| aspect_ratio | TEXT | Format d'écran |
| status | TEXT | Statut (processing/ready/error) |
| type | TEXT | Type de contenu |
| is_premium | BOOLEAN | Contenu premium |
| token_price | DECIMAL(10,2) | Prix en tokens |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Date de mise à jour |

## Développement

### Commandes disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run db:init` - Initialise la base de données
- `npm run db:migrate` - Exécute les migrations
- `npm run db:status` - Affiche l'état des migrations

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2fded085-118e-4a12-9963-359fd3d38819) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2fded085-118e-4a12-9963-359fd3d38819) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
