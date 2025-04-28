
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          XVush Creator Universe
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Bienvenue dans un nouveau type de profil créateur, conçu pour mettre en valeur votre contenu et maximiser vos revenus.
        </p>
        <Link to="/creator">
          <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark text-white">
            Voir le profil démonstration
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
