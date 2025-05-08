
import { useEffect, useState } from 'react';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveOptions {
  /**
   * Breakpoint pour les petits mobiles (xs)
   * @default 320
   */
  xs?: number;
  
  /**
   * Breakpoint pour les mobiles (sm)
   * @default 640
   */
  sm?: number;
  
  /**
   * Breakpoint pour les tablettes (md)
   * @default 768
   */
  md?: number;
  
  /**
   * Breakpoint pour les petits écrans (lg)
   * @default 1024
   */
  lg?: number;
  
  /**
   * Breakpoint pour les grands écrans (xl)
   * @default 1280
   */
  xl?: number;
  
  /**
   * Breakpoint pour les très grands écrans (2xl)
   * @default 1536
   */
  '2xl'?: number;
}

const defaultBreakpoints: ResponsiveOptions = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useResponsive = (options: ResponsiveOptions = {}) => {
  const breakpoints = { ...defaultBreakpoints, ...options };
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Fonction pour mettre à jour la taille de fenêtre
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Exécuter une fois au démarrage
    updateSize();
    
    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', updateSize);
    
    // Nettoyer l'écouteur lors du démontage
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculer les états responsives
  const isMobile = windowSize.width < (breakpoints.md || 768);
  const isDesktop = !isMobile;
  const isXs = windowSize.width < (breakpoints.sm || 640);
  const isSm = windowSize.width >= (breakpoints.sm || 640) && windowSize.width < (breakpoints.md || 768);
  const isMd = windowSize.width >= (breakpoints.md || 768) && windowSize.width < (breakpoints.lg || 1024);
  const isLg = windowSize.width >= (breakpoints.lg || 1024) && windowSize.width < (breakpoints.xl || 1280);
  const isXl = windowSize.width >= (breakpoints.xl || 1280) && windowSize.width < (breakpoints['2xl'] || 1536);
  const is2xl = windowSize.width >= (breakpoints['2xl'] || 1536);

  // Déterminer la taille d'écran actuelle
  const screenSize: ScreenSize = 
    isXs ? 'xs' :
    isSm ? 'sm' :
    isMd ? 'md' :
    isLg ? 'lg' :
    isXl ? 'xl' : '2xl';

  // Méthode utilitaire pour vérifier si la largeur est au moins celle d'une taille d'écran spécifique
  const atLeast = (size: ScreenSize): boolean => {
    const sizes: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(screenSize);
    const targetIndex = sizes.indexOf(size);
    return currentIndex >= targetIndex;
  };

  // Méthode utilitaire pour vérifier si la largeur est au plus celle d'une taille d'écran spécifique
  const atMost = (size: ScreenSize): boolean => {
    const sizes: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(screenSize);
    const targetIndex = sizes.indexOf(size);
    return currentIndex <= targetIndex;
  };

  return {
    windowSize,
    screenSize,
    isMobile,
    isDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    atLeast,
    atMost
  };
};

export default useResponsive;
