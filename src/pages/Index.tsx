
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center max-w-2xl px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          XVush Creator Universe
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Bienvenue dans un nouveau type de profil créateur, conçu pour mettre en valeur votre contenu et maximiser vos revenus.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/creator">
            <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark text-white">
              <User className="mr-2" />
              Profil Créateur
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              <LayoutDashboard className="mr-2" />
              Tableau de bord
            </Button>
          </Link>
          
          <Link to="/calendar">
            <Button size="lg" variant="outline">
              <Calendar className="mr-2" />
              Calendrier
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
