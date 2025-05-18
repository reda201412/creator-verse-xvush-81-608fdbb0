import { ensureVideosTableExists } from '../src/services/videoService';
import { query } from '../src/lib/neon';

async function initializeDatabase() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');
    
    // Tester la connexion
    const testResult = await query('SELECT NOW()');
    console.log('✅ Connexion à la base de données établie avec succès');
    console.log('🕒 Heure du serveur:', testResult.rows[0].now);
    
    // Créer la table des vidéos si elle n'existe pas
    console.log('🔄 Vérification/création de la table videos...');
    await ensureVideosTableExists();
    
    // Vérifier si la table contient des données
    const countResult = await query('SELECT COUNT(*) FROM videos');
    console.log(`📊 La table videos contient actuellement ${countResult.rows[0].count} enregistrements`);
    
    console.log('✨ Initialisation de la base de données terminée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:');
    console.error(error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeDatabase();
