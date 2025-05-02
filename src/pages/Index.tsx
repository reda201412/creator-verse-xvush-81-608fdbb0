
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, User, ExternalLink } from 'lucide-react';
import Header from "@/components/navigation/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          XVush Creator Universe
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 md:mb-12 leading-relaxed">
          Bienvenue dans un nouveau type de profil créateur, conçu pour mettre en valeur votre contenu et maximiser vos revenus.
        </p>
        
        <div className="w-full space-y-3 md:space-y-4">
          <Link to="/creator" className="w-full block">
            <Button 
              size="lg" 
              className="w-full bg-xvush-pink hover:bg-xvush-pink-dark text-white flex items-center justify-center gap-2 py-4 md:py-6 text-base md:text-lg rounded-xl"
            >
              <User className="mr-2" />
              Profil Créateur
            </Button>
          </Link>
          
          <Link to="/dashboard" className="w-full block">
            <Button
              variant="outline" 
              size="lg"
              className="w-full flex items-center justify-between py-4 md:py-6 text-base md:text-lg rounded-xl"
            >
              <div className="flex items-center">
                <LayoutDashboard className="mr-2" />
                Tableau de bord
              </div>
              <ExternalLink size={18} />
            </Button>
          </Link>
          
          <Link to="/calendar" className="w-full block">
            <Button
              variant="outline" 
              size="lg"
              className="w-full flex items-center justify-between py-4 md:py-6 text-base md:text-lg rounded-xl"
            >
              <div className="flex items-center">
                <Calendar className="mr-2" />
                Calendrier
              </div>
              <ExternalLink size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
