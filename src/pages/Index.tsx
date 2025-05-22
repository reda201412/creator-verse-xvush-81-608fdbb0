
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HamburgerMenu } from '@/components/navigation/MobileMenu';
import BottomNavigation from '@/components/navigation/BottomNavigation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Top Navigation Bar */}
      <header className="w-full bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <HamburgerMenu />
        </div>
        <div className="w-full max-w-md px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Rechercher..." 
              className="w-full pl-10 rounded-full bg-background border-muted-foreground/20"
            />
          </div>
        </div>
        <div className="flex items-center">
          {/* Placeholder for additional icons */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 flex flex-col">
        {/* Logo and Title Section */}
        <div className="text-center mb-12 mt-8">
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Insight!</p>
          </div>
          <h1 className="text-5xl font-bold">
            <span className="text-xvush-pink">X</span>
            <span className="text-slate-700">Dose</span>
          </h1>
          <div className="w-32 h-1 bg-xvush-pink mx-auto mt-3 mb-8"></div>
        </div>

        {/* Authentication Buttons */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <Button asChild size="lg" className="w-full max-w-xs bg-xvush-pink hover:bg-xvush-pink-dark rounded-full">
            <Link to="/auth" className="flex items-center justify-center">
              <ArrowRight className="mr-2 h-5 w-5" />
              Se connecter
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full max-w-xs rounded-full border-2 bg-transparent text-gray-700">
            <Link to="/auth?register=true" className="flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Créer un compte
            </Link>
          </Button>
        </div>

        {/* Trending Content Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-slate-700">Trending Content</h2>
            <Link to="/trending" className="text-xvush-pink flex items-center font-medium">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Trending Content Preview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <div className="absolute top-3 left-3 bg-amber-400 rounded-full px-4 py-1 text-white font-semibold z-10">
                Premium
              </div>
              <img 
                src="https://source.unsplash.com/random/800x450?fitness" 
                alt="Trending content" 
                className="w-full h-72 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white rounded px-2 py-1 text-sm">
                5:45
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t bg-white p-2">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center text-xvush-pink">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          
          <Link to="/trending" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <span className="text-xs mt-1">Tendances</span>
          </Link>
          
          <Link to="/creators" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="text-xs mt-1">Créateurs</span>
          </Link>
        </div>
      </nav>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
