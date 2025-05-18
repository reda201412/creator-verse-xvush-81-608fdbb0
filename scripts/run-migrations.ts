import { query } from '../src/lib/neon';
import fs from 'fs';
import path from 'path';

// Interface pour les migrations exécutées
interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

// Créer la table de suivi des migrations si elle n'existe pas
async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
}

// Obtenir la liste des migrations déjà exécutées
async function getExecutedMigrations(): Promise<Migration[]> {
  try {
    const result = await query('SELECT * FROM _migrations ORDER BY id');
    return result.rows;
  } catch (error) {
    // Si la table n'existe pas, on la crée
    if ((error as Error).message.includes('does not exist')) {
      await ensureMigrationsTable();
      return [];
    }
    throw error;
  }
}

// Exécuter une migration
async function runMigration(migrationPath: string): Promise<void> {
  const migrationName = path.basename(migrationPath);
  console.log(`🚀 Exécution de la migration: ${migrationName}`);
  
  // Lire le contenu du fichier de migration
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  // Démarrer une transaction
  await query('BEGIN');
  
  try {
    // Exécuter le script SQL
    await query(sql);
    
    // Enregistrer la migration comme exécutée
    await query(
      'INSERT INTO _migrations (name) VALUES ($1)',
      [migrationName]
    );
    
    // Valider la transaction
    await query('COMMIT');
    console.log(`✅ Migration ${migrationName} exécutée avec succès`);
  } catch (error) {
    // En cas d'erreur, annuler la transaction
    await query('ROLLBACK');
    console.error(`❌ Erreur lors de l'exécution de la migration ${migrationName}:`, error);
    throw error;
  }
}

// Fonction principale
export async function runMigrations() {
  try {
    console.log('🔍 Vérification des migrations en attente...');
    
    // Vérifier si le dossier des migrations existe
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('ℹ️ Aucun dossier de migrations trouvé');
      return;
    }
    
    // Lire les fichiers de migration
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log('ℹ️ Aucune migration à exécuter');
      return;
    }
    
    // Obtenir les migrations déjà exécutées
    const executedMigrations = await getExecutedMigrations();
    const executedMigrationNames = new Set(executedMigrations.map(m => m.name));
    
    // Exécuter les migrations en attente
    let appliedMigrations = 0;
    
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        await runMigration(path.join(migrationsDir, file));
        appliedMigrations++;
      }
    }
    
    if (appliedMigrations === 0) {
      console.log('✅ Toutes les migrations sont déjà à jour');
    } else {
      console.log(`✨ ${appliedMigrations} migration(s) appliquée(s) avec succès`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
}

// Exécuter les migrations
runMigrations();
