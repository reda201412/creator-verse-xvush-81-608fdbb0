// Script pour nettoyer les références à Supabase
const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/pages/CreatorVideos.tsx',
  'src/components/creator/videos/VideoCard.tsx'
];

filesToClean.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Supprimer les références à Supabase dans les logs et commentaires
    content = content
      .replace(/console\.log\([^)]*Supabase[^)]*\)/g, '')
      .replace(/console\.error\([^)]*Supabase[^)]*\)/g, '')
      .replace(/\/\/[^\n]*Supabase[^\n]*\n/g, '')
      .replace(/\/\*[^*]*Supabase[^*]*\*\//g, '');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Nettoyé: ${filePath}`);
  } catch (error) {
    console.error(`Erreur lors du traitement de ${filePath}:`, error.message);
  }
});
