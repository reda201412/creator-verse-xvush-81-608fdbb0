import { query } from '../src/lib/neon';
import fs from 'fs';
import path from 'path';

interface MigrationStatus {
  name: string;
  status: 'applied' | 'pending';
  executed_at?: Date;
}

async function checkMigrations() {
  try {
    console.log('🔍 Vérification de l\'état des migrations...');
    
    // Vérifier si la table des migrations existe
    const migrationsTableExists = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '_migrations')"
    );
    
    if (!migrationsTableExists.rows[0].exists) {
      console.log('ℹ️ Aucune migration n\'a encore été exécutée');
      return;
    }
    
    // Récupérer les migrations exécutées
    const executedMigrations = await query(
      'SELECT name, executed_at FROM _migrations ORDER BY executed_at'
    ) as { rows: { name: string; executed_at: Date }[] };
    
    // Vérifier le dossier des migrations
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('ℹ️ Aucun dossier de migrations trouvé');
      return;
    }
    
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log('ℹ️ Aucun fichier de migration trouvé');
      return;
    }
    
    // Créer un ensemble des noms de fichiers de migration
    const migrationFileSet = new Set(migrationFiles);
    const executedMigrationNames = new Set(executedMigrations.rows.map(m => m.name));
    
    // Vérifier les migrations manquantes ou en attente
    const allMigrations: MigrationStatus[] = [];
    
    // Ajouter les migrations exécutées
    for (const row of executedMigrations.rows) {
      allMigrations.push({
        name: row.name,
        status: 'applied',
        executed_at: row.executed_at
      });
    }
    
    // Ajouter les migrations en attente
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        allMigrations.push({
          name: file,
          status: 'pending'
        });
      }
    }
    
    // Afficher le statut
    console.log('\n📊 État des migrations :\n');
    console.log('Statut    | Nom de la migration');
    console.log('--------------------------------');
    
    for (const migration of allMigrations) {
      const status = migration.status === 'applied' 
        ? '✅ APPLIED ' 
        : '⏳ PENDING';
      const dateStr = migration.executed_at 
        ? ` (${new Date(migration.executed_at).toLocaleString()})` 
        : '';
      console.log(`${status} | ${migration.name}${dateStr}`);
    }
    
    // Vérifier les migrations orphelines (dans la base mais pas dans le système de fichiers)
    const orphanMigrations = executedMigrations.rows
      .filter(row => !migrationFileSet.has(row.name));
    
    if (orphanMigrations.length > 0) {
      console.log('\n⚠️  Avertissement : migrations orphelines (dans la base mais pas dans le système de fichiers) :');
      for (const migration of orphanMigrations) {
        console.log(`   - ${migration.name} (exécutée le ${migration.executed_at})`);
      }
    }
    
    console.log('\n✅ Vérification terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des migrations:', error);
    process.exit(1);
  }
}

// Exécuter la vérification
checkMigrations();
