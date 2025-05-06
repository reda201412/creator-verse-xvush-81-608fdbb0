
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Cette fonction doit être appelée à l'intérieur d'un composant React
  // State pour stocker notre valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Récupérer depuis le localStorage
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        // Parser la valeur stockée ou retourner initialValue
        return item ? (JSON.parse(item) as T) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Retourner une version enveloppée de la fonction setter de useState qui
  // persiste la nouvelle valeur dans localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à value d'être une fonction pour avoir la même API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans le state
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Écouter les changements dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    };
    
    // Écouter les changements pour cette clé localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    
      // Nettoyer
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
    return undefined;
  }, [key]);

  return [storedValue, setValue] as const;
}
