
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FiUser, FiVideo, FiHome, FiGrid, FiChevronRight } from 'react-icons/fi';

const Index = () => {
  const { user, isCreator } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-xvush-purple to-xvush-pink py-20 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Partagez. Créez. Connectez.
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-gray-100">
            Une plateforme où les créateurs peuvent partager du contenu exclusif et où les fans peuvent découvrir et soutenir leurs créateurs préférés.
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isCreator ? (
                <Button asChild size="lg" className="bg-white text-xvush-purple hover:bg-gray-100">
                  <Link to="/creator/profile">
                    <FiVideo className="mr-2" />
                    Gérer mon contenu
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-white text-xvush-purple hover:bg-gray-100">
                  <Link to="/feed">
                    <FiGrid className="mr-2" />
                    Explorer le contenu
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-xvush-purple hover:bg-gray-100">
                <Link to="/auth">
                  <FiUser className="mr-2" />
                  Commencer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/feed">
                  <FiGrid className="mr-2" />
                  Explorer
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                <FiVideo />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contenu Premium</h3>
              <p className="text-gray-600">Accédez à du contenu exclusif directement de vos créateurs préférés.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Monétisation Directe</h3>
              <p className="text-gray-600">Les créateurs peuvent monétiser leur contenu et recevoir le soutien de leurs fans.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Plateforme Sécurisée</h3>
              <p className="text-gray-600">Une communauté sécurisée pour partager et consommer du contenu en toute sérénité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de créateurs et de fans dès aujourd'hui.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
            <Link to={user ? "/feed" : "/auth"}>
              {user ? "Explorer le contenu" : "S'inscrire maintenant"}
              <FiChevronRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">XDose</h3>
              <p className="text-gray-400 max-w-sm">
                Une plateforme de contenu premium pour créateurs et fans.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Platforme</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">À propos</a></li>
                  <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                  <li><a href="#" className="hover:text-white">Tarifs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Ressources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Guide des créateurs</a></li>
                  <li><a href="#" className="hover:text-white">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Légal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
                  <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-white">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} XDose. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
