
import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold mb-6">Bienvenue sur Xdose</h1>
        <p className="text-xl mb-8">Découvrez des créateurs de contenu exceptionnels et profitez d'une expérience immersive unique.</p>
      </motion.div>
      
      {/* Home page content will go here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">Explorer</h2>
          <p className="text-muted-foreground mb-4">
            Découvrez les meilleurs créateurs dans votre domaine d'intérêt.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">S'abonner</h2>
          <p className="text-muted-foreground mb-4">
            Soutenez vos créateurs préférés et accédez à du contenu exclusif.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">Créer</h2>
          <p className="text-muted-foreground mb-4">
            Devenez un créateur et partagez votre passion avec la communauté.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
